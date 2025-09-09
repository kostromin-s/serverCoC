//import toàn bộ models
import ClanSV01 from "../models/Clan.js";
import WarDetail from "../models/warDetailModel.js";
import WarScore from "../models/warScoreMolde.js";
import LeagueGroup from "../models/leagueGroup.js";
import PlayerSV01 from "../models/player.js";
import listArmy from "../models/ArmyModel.js";
import Army from "../models/listTroop.js";

//Truy xuất dữ liệu từng cặp WarDetail, WarScore theo page mỗi lần lấy 40
export async function getWarDetailsWithScores(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 40;
    const clanTag = req.params.tag; // 👈 lấy từ URL /:tag

    const skip = (page - 1) * limit;

    const warDetails = await WarDetail.find({
      "clan.tag": clanTag, // dot notation vì clan là object
      battleModifier: "none",
      attacksPerMember: 2,
    })
      .sort({ endTime: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const warIds = warDetails.map((w) => w._id);
    const warScores = await WarScore.find({ war: { $in: warIds } }).lean();

    const warData = warDetails.map((warDetail) => {
      const warScore = warScores.find(
        (ws) => String(ws.war) === String(warDetail._id)
      );
      return { warDetail, warScore };
    });

    res.json({ warData, page, limit });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

//api lấy dữ liệu troop của clan
export async function getClanTroops(req, res) {
  try {
    const clanTag = req.params.tag;
    const troops = await Army.find({ clantag: clanTag });

    res.json(troops);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

//api lấy dữ liệu điểm số của người chơi trong clan
export async function getPlayerScores(req, res) {
  try {
    const clanTag = req.params.tag;
    const playerScores = await PlayerSV01.find({ "clan.tag": clanTag });

    res.json(playerScores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default { getWarDetailsWithScores, getClanTroops, getPlayerScores };
