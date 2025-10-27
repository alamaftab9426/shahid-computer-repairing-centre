const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  lastname: { type: String, required: true, trim: true },
  mobileno: { type: Number, required: true, trim: true },
  emailaddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },
  password: { type: String, required: true, },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  dob: { type: Date, required: true },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: { type: Boolean, default: true },
   // ----- NEW FIELDS FOR FORGOT PASSWORD -----

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
  
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);