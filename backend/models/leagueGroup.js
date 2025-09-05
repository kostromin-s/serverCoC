// models/cwl.js
import mongoose from "mongoose";
import { type } from "os";

// ==== Attack Schema ====
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

// ==== Member Schema ====
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

// ==== Clan Schema ====
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

// ==== War Detail Schema ====
const WarDetailSchema = new mongoose.Schema(
  {
    warTag: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    teamSize: { type: Number, required: true },
    attacksPerMember: { type: Number, required: true, default: 1 },
    battleModifier: { type: String, required: true, default: "none" },
    preparationStartTime: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    clan: { type: ClanSchema, required: true },
    opponent: { type: ClanSchema, required: true },
  },
  { timestamps: true }
);

WarDetailSchema.index(
  { "clan.tag": 1, "opponent.tag": 1, endTime: 1 },
  { unique: true }
);

// ==== League Group Schema ====
const LeagueGroupSchema = new mongoose.Schema(
  {
    state: { type: String, required: true },
    season: { type: String, required: true },
    rounds: [{ type: String, required: true }],
  },
  { timestamps: true }
);

LeagueGroupSchema.index({ season: 1 }, { unique: true });

// ==== Export Models ====

export const CWLDetail =
  mongoose.models.CWLDetail || mongoose.model("CWLDetail", WarDetailSchema);

export const LeagueGroup =
  mongoose.models.LeagueGroup ||
  mongoose.model("LeagueGroup", LeagueGroupSchema);
