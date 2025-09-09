import mongoose from "mongoose";

// Schema liệt kê tất cả troop, spell, hero, ...
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
  type: {
    type: String,
    enum: [
      "normalTroop",
      "spells",
      "superTroop",
      "builderBaseTroop",
      "hero",
      "heroEquipment",
      "pet",
      "heroBuilderBaseTroop",
      "troopCaptain",
      "spellCaptain",
      "machineTroop",
    ],
    required: true,
  },
});

const listArmy = mongoose.model("listArmy", itemSchema);
export default listArmy;
