import {
  getWarDetailsWithScores,
  getClanTroops,
} from "../controllers/getDataController.js";
import express from "express";
const router = express.Router();

// Lấy danh sách war details kèm war scores theo clan tag, page, limit
router.get("/wardetails/:tag", getWarDetailsWithScores);

// Lấy danh sách troop của clan theo clan tag
router.get("/troops/:tag", getClanTroops);

// trả về dạng: { warData: [{warDetail, warScore}], page, limit }

export default router;
