import {
  getWarDetailsWithScores,
  getClanTroops,
  getPlayerScores,
  getPlayersInClan,
} from "../controllers/getDataController.js";
import express from "express";
const router = express.Router();

// Lấy danh sách war details kèm war scores theo clan tag, page, limit
router.get("/wardetails/:tag", getWarDetailsWithScores);
// trả về dạng: { warData: [{warDetail, warScore}], page, limit }

// Lấy danh sách troop của clan theo clan tag
router.get("/troops/:tag", getClanTroops);

// Lấy danh sách điểm số của người chơi trong clan theo clan tag (có auth nhưng sẽ thêm sau nha)
router.get("/playerscores/:tag", getPlayerScores);

//Lấy thông tin cơ bản của clan theo tag
router.get("/claninfo/:tag", getPlayersInClan);

export default router;
