import cron from "node-cron";
import schedule from "node-schedule";
import axios from "axios";
import PlayerSV01 from "../models/player.js";
import DaylyPoint from "../models/daylyPoints.js";
import Alliance from "../models/Alliance.js";
import ClanSV01 from "../models/Clan.js";
import WarDetail from "../models/warDetailModel.js";
import WarScore from "../models/warScoreMolde.js";
import ClanStats from "../models/ClanStats.js";

//Kết luận kết quả war
function concludeWarResult(war) {
  if (!war || war.state !== "warEnded") return null;
  const { clan, opponent } = war;
  if (clan.stars > opponent.stars) return "win";
  if (clan.stars < opponent.stars) return "lost";
  if (clan.destructionPercentage > opponent.destructionPercentage) return "win";
  if (clan.destructionPercentage < opponent.destructionPercentage)
    return "lost";
  return "draw";
}

// Lấy ngày Việt Nam (UTC+7) với offset ngày
export function getVNDate(offsetDays = 0) {
  const now = new Date();
  now.setHours(now.getHours() + 7);
  now.setDate(now.getDate() + offsetDays);
  return now.toISOString().slice(0, 10);
}

// Lên lịch chạy công việc vào mỗi 2 phút (tính warScore)
cron.schedule("*/2 * * * *", async () => {
  try {
    const wars = await WarDetail.find({}).sort({ endTime: -1 }).limit(100);
    for (const war of wars) {
      const exists = await WarScore.exists({ war: war._id });
      if (exists || war.state !== "warEnded") continue;

      const membersOfwarScore = [];
      const ourTeam = war.clan.members || [];
      const theirTeam = war.opponent.members || [];
      const theirAttackMap = new Map();
      for (const member of theirTeam) {
        const attackerTag = member.bestOpponentAttack?.attackerTag;
        if (!attackerTag) continue;
        const list = theirAttackMap.get(attackerTag) || [];
        list.push(member);
        theirAttackMap.set(attackerTag, list);
      }
      const unDestroyedBases = theirTeam.filter(
        (m) => (m.bestOpponentAttack?.stars ?? 0) < 3
      );
      const allAttacks = ourTeam.flatMap((m) => m.attacks || []);
      const maxOrder =
        allAttacks.length > 0 ? Math.max(...allAttacks.map((a) => a.order)) : 0;

      const members = ourTeam.map((ourMember) => {
        const attacksArr = ourMember.attacks || [];
        const objmember = {
          tag: ourMember.tag,
          name: ourMember.name,
          score: 0,
          title: { keyWarrior: 0, giantSlayer: 0, drop: 0, lastHit: false },
          attacks: attacksArr.length,
        };
        const attackedMembers = theirAttackMap.get(ourMember.tag) || [];
        objmember.title.keyWarrior = attackedMembers.length;
        for (const attackedMember of attackedMembers) {
          const stars = attackedMember.bestOpponentAttack?.stars ?? 0;
          if (
            stars === 3 &&
            ourMember.townhallLevel < attackedMember.townhallLevel
          ) {
            objmember.title.giantSlayer += 1;
          }
        }
        const remain = war.attacksPerMember - attacksArr.length;
        if (remain > 0) {
          let dropCount = 0;
          for (const base of unDestroyedBases) {
            if (base.townhallLevel > ourMember.townhallLevel) continue;
            const alreadyAttacked = attacksArr.some(
              (a) => a.defenderTag === base.tag
            );
            if (alreadyAttacked) continue;
            dropCount++;
            if (dropCount >= remain) break;
          }
          objmember.title.drop = dropCount;
        }
        if (objmember.title.drop > 0) {
          objmember.score =
            -(2 + ourMember.townhallLevel * 0.1) * objmember.title.drop;
          objmember.title.keyWarrior = 0;
          objmember.title.giantSlayer = 0;
          objmember.title.lastHit = false;
        } else {
          objmember.score +=
            objmember.title.keyWarrior * (1 + ourMember.townhallLevel * 0.01);
          objmember.score += objmember.title.giantSlayer * 2;
          objmember.score += attacksArr.length;
          if (
            objmember.title.keyWarrior > 0 &&
            war.clan.destructionPercentage === 100
          ) {
            const hasLastAttack = attacksArr.some((a) => a.order === maxOrder);
            if (hasLastAttack) {
              objmember.title.lastHit = true;
              objmember.score += 2;
            }
          }
        }
        membersOfwarScore.push(objmember);
      });

      const newScore = new WarScore({
        war: war._id,
        result: concludeWarResult(war),
        members: membersOfwarScore,
        addscore: false,
      });

      await newScore.save();
    }
    console.log("✅ Hoàn tất tính warScore cho các trận war mới.");
  } catch (err) {
    console.error("❌ Lỗi khi sync WarScores:", err);
  }
});

// Tính điểm hằng ngày cho tất cả players
async function calculateDailyPoints() {
  try {
    const today = getVNDate(0);
    const yesterday = getVNDate(-1);
    const yesterdayPoints = await DaylyPoint.find({ date: yesterday }).lean();
    const clans = await PlayerSV01.find().lean();

    for (const clan of clans) {
      for (const player of clan.player) {
        const prevPoint = yesterdayPoints.find(
          (p) => p.tag === player.tag && p.clantag === clan.clantag
        ) || {
          warPoints: { value: 0, hidden: false },
          InfluencePoints: { value: 0, hidden: false },
          activepoints: { value: 0, hidden: false },
          clanGamePoints: { value: 0, hidden: false },
        };

        const ClanStatsData = await ClanStats.findOne({
          clanTag: clan.clantag,
        });
        const playerStats =
          ClanStatsData?.players.find((p) => p.playerTag === player.tag)
            ?.totalScore || 0;

        const warPointValue = Math.min(Math.max(playerStats, 0), 100);
        let activePointValue = prevPoint.activepoints.value;
        if (prevPoint.attackWins < player.attackWins) {
          activePointValue += Math.min(
            player.attackWins - prevPoint.attackWins,
            3
          );
        } else {
          activePointValue -= 2;
        }
        activePointValue = Math.min(Math.max(activePointValue, 0), 100);
        const clanGamePointValue = prevPoint.clanGamePoints.value;
        const raw =
          0.35 * Math.log(1 + activePointValue) +
          0.25 * Math.log(1 + warPointValue) +
          0.1 * Math.log(1 + player.donations) +
          0.05 * Math.log(1 + player.donationsReceived) +
          0.25 * Math.log(1 + clanGamePointValue);

        const influence = Math.min(
          Math.max(Math.round((raw / 6) * 100), 0),
          100
        );
        const influencePointValue = influence;

        const newPoints = {
          warPoints: {
            value: warPointValue,
            hidden: prevPoint.warPoints.hidden,
          },
          InfluencePoints: {
            value: influencePointValue,
            hidden: prevPoint.InfluencePoints.hidden,
          },
          activepoints: {
            value: activePointValue,
            hidden: prevPoint.activepoints.hidden,
          },
          clanGamePoints: {
            value: clanGamePointValue,
            hidden: prevPoint.clanGamePoints.hidden,
          },
        };

        await DaylyPoint.updateOne(
          { tag: player.tag, clantag: clan.clantag, date: today },
          {
            $set: {
              attackWins: player.attackWins,
              ...newPoints,
            },
            $setOnInsert: {
              tag: player.tag,
              clantag: clan.clantag,
              name: player.name,
              date: today,
            },
          },
          { upsert: true }
        );
      }
    }
    console.log("✅ Hoàn tất tính điểm hằng ngày.");
  } catch (err) {
    console.error("❌ Lỗi khi tính điểm:", err);
  }
}

// Hàm cập nhật dữ liệu warpoint liên tục
async function updateWarPoints() {
  try {
    const alliances = await Alliance.find({});
    for (const alliance of alliances) {
      for (const member of alliance.members) {
        const clanTag = member.tag;
        const wars = await WarDetail.find({ "clan.tag": clanTag })
          .sort({ endTime: -1 })
          .limit(20)
          .lean();

        const playerStatsMap = new Map();

        for (const war of wars) {
          const warScore = await WarScore.findOne({ war: war._id }).lean();
          if (!warScore || !warScore.members) continue;

          for (const memberScore of warScore.members) {
            const stats = playerStatsMap.get(memberScore.tag) || {
              playerTag: memberScore.tag,
              name: memberScore.name,
              totalScore: 0,
              totalAttacks: 0,
              warsPlayed: 0,
              titles: {
                keyWarrior: 0,
                giantSlayer: 0,
                drop: 0,
                lastHit: 0,
              },
            };

            stats.totalScore += memberScore.score;
            stats.totalAttacks += memberScore.attacks;
            stats.warsPlayed += 1;
            stats.titles.keyWarrior += memberScore.title.keyWarrior || 0;
            stats.titles.giantSlayer += memberScore.title.giantSlayer || 0;
            stats.titles.drop += memberScore.title.drop || 0;
            stats.titles.lastHit += memberScore.title.lastHit ? 1 : 0;

            playerStatsMap.set(memberScore.tag, stats);
          }
        }

        const players = Array.from(playerStatsMap.values());
        await ClanStats.updateOne(
          { clanTag },
          { clanTag, players, updatedAt: new Date() },
          { upsert: true }
        );
      }
    }
    console.log("✅ Hoàn tất cập nhật war points cho các clan.");
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật war points:", err);
  }
}

//Hàm tự động ping server giữ cho server không bị ngủ
async function autoPing() {
  try {
    await axios.get(process.env.URL_server);
  } catch (error) {
    // Không cần log lỗi ping
  }
}

// Schedule job chạy 00:01 hằng ngày
schedule.scheduleJob("1 0 * * *", calculateDailyPoints);
console.log("Đã lên lịch tính điểm hằng ngày vào 00:01");

// Schedule job chạy 3 phút 1 lần để cập nhật war points
schedule.scheduleJob("*/3 * * * *", updateWarPoints);
console.log("Đã lên lịch cập nhật war points mỗi 3 phút");

// Schedule job chạy 5 phút 1 lần để ping server
schedule.scheduleJob("*/5 * * * *", autoPing);
console.log("Đã lên lịch ping server mỗi 5 phút");
