import mongoose from "mongoose";

const playerDailyPointSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    buildPoint: { type: Number, default: 0 },
    activePoint: { type: Number, default: 0 },
    warPoint: { type: Number, default: 0 },
    clanGamePoint: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Đảm bảo mỗi tag chỉ có 1 record / ngày
playerDailyPointSchema.index({ tag: 1, date: 1 }, { unique: true });

const PlayerDailyPoint = mongoose.model(
  "PlayerDailyPoint",
  playerDailyPointSchema
);

export default PlayerDailyPoint;
