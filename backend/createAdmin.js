const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User"); // adjust path if needed

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log(" MongoDB connected successfully");
    await createAdmin();
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(" DB connection error:", err);
  });

// Create admin user function
async function createAdmin() {
  try {
    const emailaddress = "admin@test.com";

    // check if admin already exists
    const existing = await User.findOne({ emailaddress });
    if (existing) {
      console.log(" Admin already exists in database");
      return;
    }

    // hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // create new admin
    const admin = new User({
      name: "Admin",
      lastname: "User",
      mobileno: 9999999999,
      emailaddress,
      password: hashedPassword,
      gender: "male",
      dob: new Date("1990-01-01"),
      role: "admin",
    });

    await admin.save();
    console.log(" Admin created successfully");
  } catch (err) {
    console.error(" Error creating admin:", err);
  }
}
