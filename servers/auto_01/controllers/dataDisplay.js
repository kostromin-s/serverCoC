import cron from "node-cron";
import schedule from "node-schedule";
import listArmy from "../models/ArmyModel.js";
import Army from "../models/listTroop.js";
import PlayerSV01 from "../models/player.js";
import Alliance from "../models/Alliance.js";
import DaylyPoint from "../models/daylyPoints.js";
import ClanDaylyPoint from "../models/ClanDaylyPoint.js";
import ClanSV01 from "../models/Clan.js";

// Lấy ngày Việt Nam (UTC+7) với offset ngày
export function getVNDate(offsetDays = 0) {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  now.setDate(now.getDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

async function buildClanArmy(clantag) {
  const playersData = await PlayerSV01.findOne({ clantag });
  if (!playersData) return null;

  // Lấy danh sách troop mẫu
  const armyModel = await listArmy.find({});
  // Chuẩn bị army kết quả
  const clanArmy = {
    clantag,
    normalTroop: [],
    spells: [],
    superTroop: [],
    builderBaseTroop: [],
    troopCaptain: [],
    spellCaptain: [],
    machineTroop: [],
    hero: [],
    heroEquipment: [],
    pet: [],
    heroBuilderBaseTroop: [],
  };

  // Hàm phụ: tìm hoặc tạo troop trong clanArmy
  function findOrCreateTroop(troopName, village, maxLevel) {
    // Tìm trong armyModel để lấy type chính xác
    const model = armyModel.find((m) => m.name === troopName);
    let type = model ? model.type : "normalTroop";
    if (village === "builderBase") {
      type = "builderBaseTroop";
    }
    // Kiểm tra xem troop đã tồn tại trong clanArmy[type] chưa
    let troop = clanArmy[type].find((t) => t.name === troopName);

    if (!troop) {
      troop = {
        name: model ? model.name : troopName,
        img: model ? model.img : undefined,
        maxLevel: maxLevel || 1,
        member: [],
      };
      clanArmy[type].push(troop);
    }

    return troop;
  }

  // Duyệt qua từng player và thêm troop của họ
  for (const player of playersData.player) {
    for (const troop of player.troops) {
      const troopEntry = findOrCreateTroop(
        troop.name,
        troop.village,
        troop.maxLevel
      );
      troopEntry.member.push({
        name: player.name,
        level: troop.level,
        active: troop.superTroopIsActive || false,
      });
    }

    for (const spell of player.spells) {
      const troopEntry = findOrCreateTroop(spell.name, "home", spell.maxLevel);
      troopEntry.member.push({
        name: player.name,
        level: spell.level,
      });
    }
  }

  //Duyệt qua từng nhóm loại troop trong armyModel để đảm bảo tất cả troop đều có như trong mẫu listArmy
  //Nếu chưa có thì thêm mới với member rỗng
  //Điều này giúp hiển thị đầy đủ troop trong giao diện dù không có ai sở hữu
  //không lấy các loại hero, pet, heroEquipment, heroBuilderBaseTroop vì không cần thiết hiển thị tất cả
  const filteredArmyModel = armyModel.filter(
    (m) =>
      m.type !== "hero" &&
      m.type !== "pet" &&
      m.type !== "heroEquipment" &&
      m.type !== "heroBuilderBaseTroop"
  );
  filteredArmyModel.forEach((model) => {
    findOrCreateTroop(model.name, model.village, model.maxLevel);
  });

  // Sắp xếp member theo level giảm dần cho tất cả các loại troop
  Object.keys(clanArmy).forEach((type) => {
    if (Array.isArray(clanArmy[type])) {
      clanArmy[type].forEach((troop) => {
        if (troop.member && troop.member.length > 0) {
          troop.member.sort((a, b) => b.level - a.level);
        }
      });
    }
  });

  // Lưu kết quả
  const result = await Army.findOneAndUpdate({ clantag }, clanArmy, {
    upsert: true,
    new: true,
  });

  return result;
}

// Chạy hàm buildClanArmy cho từng clantag trong DB
async function updateAllClans() {
  const clans = await PlayerSV01.find({}, "clantag");
  for (const clan of clans) {
    await buildClanArmy(clan.clantag);
  }
  console.log("Updated all clans' armies.");
}

//Tổng điểm theo ngày cho tất cả clan để phục vụ bảng xếp hạng
async function calculateClanDailyPoints() {
  const clans = await Alliance.findOne({});
  const today = getVNDate(0); // Ngày hôm nay
  const resetDay = clans.settings.resetDay; // Ngày reset hàng tháng
  //tính chênh lệch ngày hiện tại với ngày reset
  const [year, month, day] = today.split("-").map(Number);
  const resetDate = new Date(year, month - 1, resetDay);
  const todayDate = new Date(year, month - 1, day);
  let offsetDays = todayDate.getDate() - resetDate.getDate();

  for (const clan of clans.members) {
    const clantag = clan.tag;
    // Truy vấn tất cả điểm ngày hôm nay của các thành viên trong clan
    const allPoints = await DaylyPoint.find({ clantag, date: today });

    // Nếu không có thành viên thì bỏ tất cả chỉ số bằng 0
    if (!allPoints.length) {
      await ClanDaylyPoint.updateOne(
        { clantag, date: today },
        {
          $set: { warPoints: 0, activepoints: 0, supportPoints: 0 },
        },
        { upsert: true }
      );
      continue;
    }

    // Tính trung bình từng loại điểm
    const avg = {
      warPoints: 0,
      activepoints: 0,
      supportPoints: 0,
    };
    let totalWarPoints = 0;
    let totalActivepoints = 0;
    allPoints.forEach((p) => {
      totalActivepoints += p.activepoints.value;
      totalWarPoints += p.warPoints.value;
    });

    const infoClan = await ClanSV01.findOne({ tag: clantag });
    if (!infoClan) {
      avg.supportPoints = 0;
    } else {
      let totalDonations = 0;
      let totaldonationsReceived = 0;
      for (const member of infoClan.memberList) {
        totalDonations += member.donations || 0;
        totaldonationsReceived += member.donationsReceived || 0;
      }
      //in trước điểm đóng góp và nhận đóng góp để kiểm tra
      console.log(
        `Clan ${clantag} - Tổng donate: ${totalDonations}, Tổng donateReceived: ${totaldonationsReceived}, Số thành viên: ${infoClan.members}`
      );

      const rawSupportPoints =
        (totalDonations + totaldonationsReceived / 2) / infoClan.members;
      console.log(`Clan ${clantag} - Điểm hỗ trợ thô: ${rawSupportPoints}`);
      avg.supportPoints = Math.min(
        100,
        Math.max(
          0,
          (rawSupportPoints / (clans.settings.dailySupportAvg * offsetDays)) *
            100
        )
      );
    }
    avg.warPoints = totalWarPoints / infoClan.members;
    avg.activepoints = totalActivepoints / infoClan.members;

    // Lưu vào DB
    await ClanDaylyPoint.updateOne(
      { clantag, date: today },
      {
        $set: {
          warPoints: Math.round(avg.warPoints * 100) / 100,
          activepoints: Math.round(avg.activepoints * 100) / 100,
          supportPoints: Math.round(avg.supportPoints * 100) / 100,
        },
      },
      { upsert: true }
    );
    console.log(`Clan ${clantag} - Trung bình ngày ${today}:`, avg);
  }
  console.log("Đã tính trung bình điểm ngày cho tất cả clan.");
}

// Chạy 1 phút 1 lần
schedule.scheduleJob("*/1 * * * *", updateAllClans);

schedule.scheduleJob(
  { rule: "0 0 * * *", tz: "Asia/Ho_Chi_Minh" },
  calculateClanDailyPoints
);
