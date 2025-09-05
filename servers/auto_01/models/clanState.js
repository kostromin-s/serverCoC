import mongoose from "mongoose";

const ClanStateSchema = new mongoose.Schema({
  inCWL: { type: Boolean, default: false },
});

export const clanState = mongoose.model("ClanState", ClanStateSchema);
