import Alliance from "../models/Alliance.js";
import PlayerSV01 from "../models/player.js";
import ClanSV01 from "../models/Clan.js";
import WarDetail from "../models/warDetailModel.js";
import LeagueGroup from "../models/leagueGroup.js";
import {
  getClanByTag,
  getCurrentWarLeagueGroup,
  getWarLeagueWarDetails,
  getCurrentWar,
  getPlayerByTag,
  getNormalWarDetails,
} from "./cocController.js";
import ClanState from "../models/clanState.js";

// Hàm delay
function DelayNode(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Chuyển đổi định dạng ngày tháng từ CoC sang Date object
function parseCoCDate(dateStr) {
  if (!dateStr) return null; // bỏ qua nếu không có dữ liệu
  if (dateStr instanceof Date) return dateStr; // đã là Date thì giữ nguyên
  if (typeof dateStr !== "string") return null; // nếu không phải string thì bỏ qua

  // format CoC: YYYYMMDDTHHmmss.SSSZ
  return new Date(
    dateStr.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).000Z/,
      "$1-$2-$3T$4:$5:$6.000Z"
    )
  );
}

function normalizeWarDates(war) {
  if (!war) return war;
  if (war.preparationStartTime)
    war.preparationStartTime = parseCoCDate(war.preparationStartTime);
  if (war.startTime) war.startTime = parseCoCDate(war.startTime);
  if (war.endTime) war.endTime = parseCoCDate(war.endTime);
  return war;
}

// Lưu hoặc cập nhật dữ liệu clan
export async function saveClanData(clan) {
  const oldData = await ClanSV01.findOne({ tag: clan.tag });
  if (!oldData) {
    const newClan = new ClanSV01(clan);
    await newClan.save();
    console.log(`Clan ${clan.name} saved.`);
  } else {
    await ClanSV01.updateOne({ tag: clan.tag }, clan);
    console.log(`Clan ${clan.name} updated.`);
  }
}

//Lưu dữ liệu war
export async function saveWarData(war) {
  war = normalizeWarDates(war);

  const query = {
    "clan.tag": war.clan?.tag,
    "opponent.tag": war.opponent?.tag,
    endTime: war.endTime,
  };

  const oldWar = await WarDetail.findOne(query);
  if (!oldWar) {
    const newWar = new WarDetail(war);
    await newWar.save();
    console.log(`War ${war.clan?.name} vs ${war.opponent?.name} saved.`);
  } else {
    await WarDetail.updateOne(query, war);
    console.log(`War ${war.clan?.name} vs ${war.opponent?.name} updated.`);
  }
}

// Lưu dữ liệu liên minh và các clan, player liên quan
export async function saveAllianceData() {
  const alliances = await Alliance.findOne();
  if (!alliances) {
    const newAlliance = new Alliance({
      name: "Alliance SV01",
      adminClan: "#UPQJR8JR",
      members: [],
    });
    await newAlliance.save();
    console.log("Alliance data saved.");
    return;
  }

  for (const clanmember of alliances.members) {
    const member = clanmember.tag;
    const clan = await getClanByTag(member);
    // Nếu clan có trường datetime thì parse trước khi lưu
    if (clan.createdDate) clan.createdDate = parseCoCDate(clan.createdDate);
    await saveClanData(clan);
    await DelayNode(120);

    const memberList = clan.memberList;
    const playerOfclan = [];
    for (const player of memberList) {
      // Nếu player có trường datetime thì parse trước khi lưu
      if (player.joinedDate)
        player.joinedDate = parseCoCDate(player.joinedDate);
      const playerData = await getPlayerByTag(player.tag);
      if (playerData.joinedDate)
        playerData.joinedDate = parseCoCDate(playerData.joinedDate);
      playerOfclan.push(playerData);
      await DelayNode(120);
    }
    await PlayerSV01.updateOne(
      { clantag: clan.tag },
      { clantag: clan.tag, player: playerOfclan },
      { upsert: true }
    );
    console.log(`Player of clan ${clan.name} updated.`);
    const war7day = await getCurrentWarLeagueGroup(member);
    war7day.state = war7day ? war7day.state : "notInWar";
    if (war7day.state === "inWar") {
      console.log("Clan đang trong war league");
      //tạo mới hoặc cập nhật trạng thái clanState
      // Đảm bảo luôn có ClanState cho clan thành viên
      await ClanState.updateOne(
        { clanTag: member },
        { $setOnInsert: { clanTag: member, stateCwl: false } },
        { upsert: true }
      );
    }
    const clanState = await ClanState.findOne({ clanTag: member });
    const state = clanState ? clanState.stateCwl : false;

    if (state) {
      const rounds = [];

      for (const round of war7day.rounds) {
        for (const war of round.warTags) {
          if (war === "#0") continue;

          const newDataWarDetails = await getWarLeagueWarDetails(war);
          if (!newDataWarDetails || newDataWarDetails.reason === "notFound") {
            console.log("Không có dữ liệu war league hoặc trả về lỗi");
            await DelayNode(120);
            continue;
          }

          // Parse datetime
          if (newDataWarDetails.preparationStartTime)
            newDataWarDetails.preparationStartTime = parseCoCDate(
              newDataWarDetails.preparationStartTime
            );
          if (newDataWarDetails.startTime)
            newDataWarDetails.startTime = parseCoCDate(
              newDataWarDetails.startTime
            );
          if (newDataWarDetails.endTime)
            newDataWarDetails.endTime = parseCoCDate(newDataWarDetails.endTime);

          await DelayNode(120);

          if (
            newDataWarDetails.clan.tag === member ||
            newDataWarDetails.opponent.tag === member
          ) {
            if (newDataWarDetails.clan.tag === member) {
              await saveWarData(newDataWarDetails);
            } else {
              [newDataWarDetails.clan, newDataWarDetails.opponent] = [
                newDataWarDetails.opponent,
                newDataWarDetails.clan,
              ];
              await saveWarData(newDataWarDetails);
            }
            rounds.push({
              clanTag: newDataWarDetails.clan.tag,
              opponentTag: newDataWarDetails.opponent.tag,
              endTime: newDataWarDetails.endTime,
            });
          }
        }

        await LeagueGroup.updateOne(
          { season: war7day.season, clanTag: member },
          {
            state: war7day.state,
            season: war7day.season,
            clanTag: member,
            rounds,
          },
          { upsert: true }
        );
        console.log(`LeagueGroup ${war7day.season} updated with rounds.`);
        await ClanState.updateOne(
          { clanTag: member },
          { clanTag: member, stateCwl: false },
          { upsert: true }
        );
      }
    } else {
      console.log(`⚠️ Clan ${member} không tham gia CWL, kiểm tra war thường.`);
      const currentWar = await getNormalWarDetails(member);
      if (!currentWar || currentWar.reason === "notFound") {
        console.log("Không có dữ liệu war hoặc trả về lỗi");
        continue;
      }

      if (currentWar.state === "notInWar") {
        await DelayNode(120);
        console.log("Clan hiện không trong war");
        continue;
      } else {
        await saveWarData(currentWar);
      }
    }
  }
}
