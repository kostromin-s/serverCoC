import Alliance from "../models/Alliance.js";
import PlayerSV01 from "../models/player.js";
import ClanSV01 from "../models/Clan.js";
import WarDetail from "../models/warDetailModel.js";
import {
  getClanByTag,
  getCurrentWarLeagueGroup,
  getWarLeagueWarDetails,
  getCurrentWar,
  getPlayerByTag,
} from "./cocController.js";

// Hàm delay
function DelayNode(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// Lưu hoặc cập nhật dữ liệu player
export async function savePlayerData(player) {
  const oldData = await PlayerSV01.findOne({ tag: player.tag });
  if (!oldData) {
    const newPlayer = new PlayerSV01(player);
    await newPlayer.save();
    console.log(`Player ${player.name} saved.`);
  } else {
    await PlayerSV01.updateOne({ tag: player.tag }, player);
    console.log(`Player ${player.name} updated.`);
  }
}

//Lưu dữ liệu war
export async function saveWarData(war) {
  // Đảm bảo mỗi war chỉ tồn tại duy nhất dựa trên clan.tag, opponent.tag, endTime
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
    await saveClanData(clan); // thêm await
    await DelayNode(120);

    const memberList = clan.memberList;
    for (const player of memberList) {
      const playerData = await getPlayerByTag(player.tag);
      await savePlayerData(playerData); // thêm await
      await DelayNode(120);
    }

    const war7day = await getCurrentWarLeagueGroup(member);
    if (war7day && war7day.state === "inWar") {
      for (const round of war7day.rounds) {
        for (const war of round.warTags) {
          if (war === "#0") continue;

          const newDataWarDetails = await getWarLeagueWarDetails(war);
          console.log(newDataWarDetails);
          await DelayNode(120);

          if (
            newDataWarDetails.clan.tag === member ||
            newDataWarDetails.opponent.tag === member
          ) {
            if (newDataWarDetails.clan.tag === member) {
              await saveWarData(newDataWarDetails); // thêm await
            } else {
              [newDataWarDetails.clan, newDataWarDetails.opponent] = [
                newDataWarDetails.opponent,
                newDataWarDetails.clan,
              ];
              await saveWarData(newDataWarDetails); // thêm await
            }
          }
        }
      }
    } else {
      const currentWar = await getCurrentWar(member);
      if (currentWar.state === "notInWar") {
        await DelayNode(120);
        console.log("Clan hiện không trong war");
        continue; // dùng continue thay vì return -> xử lý tiếp clan khác
      } else {
        await saveWarData(currentWar); // thêm await
      }
    }
  }
}
