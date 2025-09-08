import mongoose from "mongoose";

const PlayerStatsSchema = new mongoose.Schema({
  playerTag: { type: String, required: true },
  name: { type: String, required: true },
  totalScore: { type: Number, default: 0 },
  totalAttacks: { type: Number, default: 0 },
  warsPlayed: { type: Number, default: 0 },
  titles: {
    keyWarrior: { type: Number, default: 0 },
    giantSlayer: { type: Number, default: 0 },
    drop: { type: Number, default: 0 },
    lastHit: { type: Number, default: 0 },
  },
});

const ClanStatsSchema = new mongoose.Schema({
  clanTag: { type: String, required: true, unique: true },
  players: [PlayerStatsSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("ClanStats", ClanStatsSchema);
