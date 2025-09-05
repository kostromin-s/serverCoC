// models/playerModel.js
import mongoose from "mongoose";

const activityStatusSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
});

const troopSchema = new mongoose.Schema({
  name: String,
  level: Number,
  maxLevel: Number,
  superTroopIsActive: { type: Boolean, default: false },
  village: String,
});

const heroEquipmentSchema = new mongoose.Schema({
  name: String,
  level: Number,
  maxLevel: Number,
  village: String,
});

const heroSchema = new mongoose.Schema({
  name: String,
  level: Number,
  maxLevel: Number,
  equipment: [heroEquipmentSchema],
  village: String,
});

const spellSchema = new mongoose.Schema({
  name: String,
  level: Number,
  maxLevel: Number,
  village: String,
});

const playerSchema = new mongoose.Schema(
  {
    // --- Thông tin cơ bản ---
    tag: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    tagClan: { type: String, default: null, trim: true },

    // --- Điểm tự tính ---
    buildPoint: { type: Number, default: 0 },
    activePoint: { type: Number, default: 0 },
    warPoint: { type: Number, default: 0 },
    clanGamePoint: { type: Number, default: 0 },
    rolePoint: { type: Number, default: 0 },

    // --- Dữ liệu game từ API ---
    townHallLevel: { type: Number, default: 0 },
    townHallWeaponLevel: { type: Number, default: 0 },
    expLevel: { type: Number, default: 0 },
    trophies: { type: Number, default: 0 },
    bestTrophies: { type: Number, default: 0 },
    warStars: { type: Number, default: 0 },
    attackWins: { type: Number, default: 0 },
    defenseWins: { type: Number, default: 0 },
    builderHallLevel: { type: Number, default: 0 },
    builderBaseTrophies: { type: Number, default: 0 },
    bestBuilderBaseTrophies: { type: Number, default: 0 },
    role: { type: String, default: "member" },
    warPreference: { type: String, default: "in" },
    donations: { type: Number, default: 0 },
    donationsReceived: { type: Number, default: 0 },
    clanCapitalContributions: { type: Number, default: 0 },

    // --- Theo dõi hoạt động ---
    activityStatus: { type: [activityStatusSchema], default: [] },

    // --- Thêm các trường mới ---
    troops: { type: [troopSchema], default: [] },
    heroes: { type: [heroSchema], default: [] },
    heroEquipment: { type: [heroEquipmentSchema], default: [] },
    spells: { type: [spellSchema], default: [] },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);

export default Player;
