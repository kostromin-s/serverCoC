import cron from "node-cron";
import schedule from "node-cron";
import listArmy from "../models/ArmyModel.js";
import Army from "../models/listTroop.js";
import PlayerSV01 from "../models/player.js";

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

// Chạy ngay khi khởi động server
updateAllClans();
