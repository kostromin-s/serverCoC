import mongoose from "mongoose";

const daylyPointSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    clantag: { type: String, required: true },
    name: { type: String, required: true },
    date: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        now.setHours(now.getHours() + 7); // VN timezone
        return now.toISOString().split("T")[0];
      },
    },

    attackWins: { type: Number, required: true, default: 0 },

    warPoints: {
      value: { type: Number, required: true, default: 0 },
      hidden: { type: Boolean, required: true, default: false },
    },

    InfluencePoints: {
      value: { type: Number, required: true, default: 0 },
      hidden: { type: Boolean, required: true, default: false },
    },

    activepoints: {
      value: { type: Number, required: true, default: 0 },
      hidden: { type: Boolean, required: true, default: false },
    },

    clanGamePoints: {
      value: { type: Number, required: true, default: 0 },
      hidden: { type: Boolean, required: true, default: false },
    },
  },
  { timestamps: true } // để tiện sort theo createdAt, updatedAt
);

// mỗi player (tag) chỉ có 1 record cho 1 ngày
daylyPointSchema.index({ tag: 1, clantag: 1, date: 1 }, { unique: true });

const DaylyPoint = mongoose.model("DaylyPoint", daylyPointSchema);
export default DaylyPoint;
