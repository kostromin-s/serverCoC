import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    default: "Guest",
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
    default:
      "https://static.wikia.nocookie.net/clashofclans/images/9/9b/Profilbild_Dorfbewohner.png/revision/latest?cb=20150820221817&path-prefix=de",
  },
  tags: {
    type: [String],
    default: [],
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
