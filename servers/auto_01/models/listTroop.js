import mongoose from "mongoose";

// Schema dùng chung cho tất cả troop, spell, hero, ...
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default:
      "https://i.pinimg.com/736x/f0/60/be/f060bea17b9dadd4b2a474f89567f703.jpg",
  },
  maxLevel: { type: Number, default: 1 },
  active: { type: Boolean, default: false }, // Chỉ dùng cho super troop
  member: [{ name: String, level: Number, active: Boolean }], // Dùng để lưu level lính của từng thành viên
});

// Schema tổng hợp tất cả các loại vào một collection
const armySchema = new mongoose.Schema({
  clantag: { type: String, required: true, unique: true },
  normalTroop: [itemSchema],
  spells: [itemSchema],
  superTroop: [itemSchema],
  builderBaseTroop: [itemSchema],
  troopCaptain: [itemSchema],
  spellCaptain: [itemSchema],
  machineTroop: [itemSchema],
  hero: [itemSchema],
  heroEquipment: [itemSchema],
  pet: [itemSchema],
  heroBuilderBaseTroop: [itemSchema],
});

// Tạo model tổng
const Army = mongoose.model("Army", armySchema);

export default Army;
