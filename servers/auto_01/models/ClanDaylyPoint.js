import mongoose from "mongoose";

const clanDaylyPointSchema = new mongoose.Schema({
  clantag: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  warPoints: { type: Number, required: true, default: 0 },
  activepoints: { type: Number, required: true, default: 0 },
  supportPoints: { type: Number, required: true, default: 0 },
});

clanDaylyPointSchema.index({ clantag: 1, date: 1 }, { unique: true });
const ClanDaylyPoint = mongoose.model("ClanDaylyPoint", clanDaylyPointSchema);
export default ClanDaylyPoint;
