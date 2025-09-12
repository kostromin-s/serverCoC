import mongoose from "mongoose";

const clanStateSchema = new mongoose.Schema({
  clanTag: { type: String, required: true, unique: true },
  stateCwl: { type: Boolean, required: true, default: false },
});
clanStateSchema.index({ clanTag: 1 }, { unique: true });
const ClanState = mongoose.model("ClanState", clanStateSchema);

export default ClanState;
