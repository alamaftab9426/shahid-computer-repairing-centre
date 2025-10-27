const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profilePhoto: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
