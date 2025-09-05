import mongoose from "mongoose";

const AttackSchema = new mongoose.Schema(
  {
    attackerTag: { type: String, required: true },
    defenderTag: { type: String, required: true },
    stars: { type: Number, required: true },
    destructionPercentage: { type: Number, required: true },
    order: { type: Number, required: true },
    duration: { type: Number, required: true },
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    name: { type: String, required: true },
    townhallLevel: { type: Number, required: true },
    mapPosition: { type: Number, required: true },
    attacks: { type: [AttackSchema], default: [] },
    opponentAttacks: { type: Number, default: 0 },
    bestOpponentAttack: { type: AttackSchema },
  },
  { _id: false }
);

const ClanSchema = new mongoose.Schema(
  {
    tag: { type: String, required: true },
    name: { type: String, required: true },
    badgeUrls: {
      small: String,
      large: String,
      medium: String,
    },
    clanLevel: { type: Number, required: true },
    attacks: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    destructionPercentage: { type: Number, default: 0 },
    members: { type: [MemberSchema], default: [] },
  },
  { _id: false }
);

const WarDetailSchema = new mongoose.Schema({
  state: { type: String, required: true },
  teamSize: { type: Number, required: true },
  attacksPerMember: { type: Number, required: true, default: 1 },
  battleModifier: { type: String, required: true, default: "none" },
  preparationStartTime: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  clan: { type: ClanSchema, required: true },
  opponent: { type: ClanSchema, required: true },
});

WarDetailSchema.index(
  { "clan.tag": 1, "opponent.tag": 1, endTime: 1 },
  { unique: true }
);

const WarDetail = mongoose.model("WarDetail", WarDetailSchema);

export default WarDetail;
