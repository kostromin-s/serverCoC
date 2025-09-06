import mongoose from "mongoose";

// ==== League Group Schema ====
const LeagueGroupSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    season: { type: String, required: true },
    clanTag: { type: String, required: true },
    // Mỗi round lưu 1 trận bạn quan tâm
    rounds: [
      {
        clanTag: { type: String, required: true }, // tag clan bạn tham gia
        opponentTag: { type: String, required: true }, // tag clan đối thủ
        endTime: { type: Date, required: true }, // dùng để tìm war chính xác
      },
    ],
  },
  { timestamps: true }
);

// index theo season (unique)
LeagueGroupSchema.index({ season: 1, clanTag: 1 }, { unique: true });

// Export model
const LeagueGroup = mongoose.model("LeagueGroup", LeagueGroupSchema);
export default LeagueGroup;
