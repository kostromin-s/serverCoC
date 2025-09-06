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

// Chuyển đổi định dạng ngày tháng từ CoC sang Date object
function parseCoCDate(dateStr) {
  // format CoC: YYYYMMDDTHHmmss.SSSZ
  // ví dụ: 20250904T063557.000Z
  return new Date(
    dateStr.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2}).000Z/,
      "$1-$2-$3T$4:$5:$6.000Z"
    )
  );
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
  // Parse các trường datetime trước khi lưu
  if (war.preparationStartTime)
    war.preparationStartTime = parseCoCDate(war.preparationStartTime);
  if (war.startTime) war.startTime = parseCoCDate(war.startTime);
  if (war.endTime) war.endTime = parseCoCDate(war.endTime);

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
    for (const player of memberList) {
      // Nếu player có trường datetime thì parse trước khi lưu
      if (player.joinedDate)
        player.joinedDate = parseCoCDate(player.joinedDate);
      const playerData = await getPlayerByTag(player.tag);
      if (playerData.joinedDate)
        playerData.joinedDate = parseCoCDate(playerData.joinedDate);
      await savePlayerData(playerData);
      await DelayNode(120);
    }

    const war7day = await getCurrentWarLeagueGroup(member);
    if (war7day && war7day.state === "inWar") {
      // Nếu war7day có trường datetime thì parse
      if (war7day.startTime)
        war7day.startTime = parseCoCDate(war7day.startTime);
      if (war7day.endTime) war7day.endTime = parseCoCDate(war7day.endTime);
      for (const round of war7day.rounds) {
        for (const war of round.warTags) {
          if (war === "#0") continue;

          const newDataWarDetails = await getWarLeagueWarDetails(war);
          // Parse các trường datetime của warDetail
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
          console.log(newDataWarDetails);
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
          }
        }
      }
    } else {
      const currentWar = await getCurrentWar(member);
      // Parse các trường datetime của currentWar
      if (currentWar.preparationStartTime)
        currentWar.preparationStartTime = parseCoCDate(
          currentWar.preparationStartTime
        );
      if (currentWar.startTime)
        currentWar.startTime = parseCoCDate(currentWar.startTime);
      if (currentWar.endTime)
        currentWar.endTime = parseCoCDate(currentWar.endTime);
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
