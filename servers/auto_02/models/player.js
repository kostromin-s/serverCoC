import mongoose from "mongoose";

const BadgeUrlsSchema = new mongoose.Schema(
  {
    small: String,
    large: String,
    medium: String,
  },
  { _id: false }
);

const ClanSchema = new mongoose.Schema(
  {
    tag: String,
    name: String,
    clanLevel: Number,
    badgeUrls: BadgeUrlsSchema,
  },
  { _id: false }
);

const BuilderBaseLeagueSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
  },
  { _id: false }
);

const AchievementSchema = new mongoose.Schema(
  {
    name: String,
    stars: Number,
    value: Number,
    target: Number,
    info: String,
    completionInfo: String,
    village: String,
  },
  { _id: false }
);

const PlayerHouseElementSchema = new mongoose.Schema(
  {
    type: String,
    id: Number,
  },
  { _id: false }
);

const PlayerHouseSchema = new mongoose.Schema(
  {
    elements: [PlayerHouseElementSchema],
  },
  { _id: false }
);

const LabelIconUrlsSchema = new mongoose.Schema(
  {
    small: String,
    medium: String,
  },
  { _id: false }
);

const LabelSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    iconUrls: LabelIconUrlsSchema,
  },
  { _id: false }
);

const TroopSchema = new mongoose.Schema(
  {
    name: String,
    level: Number,
    maxLevel: Number,
    superTroopIsActive: Boolean,
    village: String,
  },
  { _id: false }
);

const EquipmentSchema = new mongoose.Schema(
  {
    name: String,
    level: Number,
    maxLevel: Number,
    village: String,
  },
  { _id: false }
);

const HeroSchema = new mongoose.Schema(
  {
    name: String,
    level: Number,
    maxLevel: Number,
    equipment: [EquipmentSchema],
    village: String,
  },
  { _id: false }
);

const SpellSchema = new mongoose.Schema(
  {
    name: String,
    level: Number,
    maxLevel: Number,
    village: String,
  },
  { _id: false }
);

const PlayerSchema = new mongoose.Schema({
  tag: String,
  name: String,
  townHallLevel: Number,
  townHallWeaponLevel: Number,
  expLevel: Number,
  trophies: Number,
  bestTrophies: Number,
  warStars: Number,
  attackWins: Number,
  defenseWins: Number,
  builderHallLevel: Number,
  builderBaseTrophies: Number,
  bestBuilderBaseTrophies: Number,
  role: String,
  warPreference: String,
  donations: Number,
  donationsReceived: Number,
  clanCapitalContributions: Number,
  clan: ClanSchema,
  builderBaseLeague: BuilderBaseLeagueSchema,
  achievements: [AchievementSchema],
  playerHouse: PlayerHouseSchema,
  labels: [LabelSchema],
  troops: [TroopSchema],
  heroes: [HeroSchema],
  heroEquipment: [EquipmentSchema],
  spells: [SpellSchema],
});

const PlayerSV01 = mongoose.model("PlayerSV01", PlayerSchema);
export default PlayerSV01;
