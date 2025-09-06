import mongoose from "mongoose";

const BadgeUrlsSchema = new mongoose.Schema(
  {
    small: String,
    medium: String,
    large: String,
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    isCountry: Boolean,
    countryCode: String,
  },
  { _id: false }
);

const MemberSchema = new mongoose.Schema(
  {
    tag: String,
    name: String,
    role: String,
    expLevel: Number,
    league: {
      id: Number,
      name: String,
      iconUrls: BadgeUrlsSchema,
    },
    trophies: Number,
    clanRank: Number,
    previousClanRank: Number,
    donations: Number,
    donationsReceived: Number,
  },
  { _id: false }
);

const ClanSchema = new mongoose.Schema({
  tag: String,
  name: String,
  type: String,
  description: String,
  location: LocationSchema,
  badgeUrls: BadgeUrlsSchema,
  clanLevel: Number,
  clanPoints: Number,
  clanVersusPoints: Number,
  requiredTrophies: Number,
  requiredTownhallLevel: Number,
  warFrequency: String,
  warWinStreak: Number,
  warWins: Number,
  warTies: Number,
  warLosses: Number,
  isFamilyFriendly: Boolean,
  members: Number,
  memberList: [MemberSchema],
  labels: [
    {
      id: Number,
      name: String,
      iconUrls: BadgeUrlsSchema,
    },
  ],
  chatLanguage: {
    id: Number,
    name: String,
    languageCode: String,
  },
});

const ClanSV01 = mongoose.model("ClanSV01", ClanSchema);
export default ClanSV01;
