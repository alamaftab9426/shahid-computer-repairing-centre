const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User"); // Adjust path if needed

//  FIXED: Use MONGO_URI (from your .env file)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  createAdmin();
}).catch(err => {
  console.error("DB error:", err);
});

async function createAdmin() {
  const emailaddress = "admin@test.com";

  const existing = await User.findOne({ emailaddress });
  if (existing) {
    console.log("Admin already exists");
    mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Admin",
    lastname: "User",
    mobileno: 9999999999,
    emailaddress,
    password: hashedPassword,
    gender: "male",
    dob: new Date("1990-01-01"),
    role: "admin"
  });

  await admin.save();
  console.log("Admin created successfully");
  mongoose.disconnect();
}
