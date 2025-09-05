import mongoose from "mongoose";

const MenberScore = new mongoose.Schema({
  tag: { type: String, required: true },
  name: { type: String, required: true },
  score: { type: Number, required: true },
  title: {
    keyWarrior: { type: Number, default: 0 },
    giantSlayer: { type: Number, default: 0 },
    drop: { type: Number, default: 0 },
    lastHit: { type: Boolean, default: false },
  },
  attacks: { type: Number, required: true },
});

const WarScoreSchema = new mongoose.Schema({
  war: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WarDetail",
    required: true,
    unique: true, // mỗi war chỉ có 1 record điểm
  },
  result: { type: String, required: true },
  members: { type: [MenberScore], required: true },
  addscore: { type: Boolean, default: false },
});

const WarScore = mongoose.model("WarScore", WarScoreSchema);

export default WarScore;
