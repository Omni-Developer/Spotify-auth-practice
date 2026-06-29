const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["artist", "listener"],
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  profilePic: {
    type: String,
    default: null,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
