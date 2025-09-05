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
});

// Schema tổng hợp tất cả các loại vào một collection
const armySchema = new mongoose.Schema({
  normalTroop: [itemSchema],
  spells: [itemSchema],
  superTroop: [itemSchema],
  builderBaseTroop: [itemSchema],
  hero: [itemSchema],
  heroEquipment: [itemSchema],
  heroBuilderBaseTroop: [itemSchema],
  troopCaptain: [itemSchema],
  spellCaptain: [itemSchema],
});

// Tạo model tổng
const Army = mongoose.model("Army", armySchema);

export default Army;
