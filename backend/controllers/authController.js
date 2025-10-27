const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");


// ---------- FORGOT PASSWORD ----------
const forgotPassword = async (req, res) => {
  const { emailaddress } = req.body;
  try {
    const user = await User.findOne({ emailaddress });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🔹 Token generate
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // 🔹 Send mail
    const resetURL = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

  await transporter.sendMail({
  from: `"Shahid Computers" <${process.env.EMAIL_USER}>`,
  to: user.emailaddress,
  subject: "Password Reset Request",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; background-color: #fff;">
      <h2 style="color: #e53e3e; text-align: center;">Password Reset Request</h2>
      <p>Hello ${user.name},</p>
      <p>You recently requested to reset your password. Click the button below to reset it:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="
          display: inline-block;
          padding: 12px 25px;
          font-size: 16px;
          color: #fff;
          background: linear-gradient(90deg, #f56565, #c53030);
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        ">Reset Password</a>
      </div>

      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;"><a href="${resetURL}" style="color: #3182ce;">${resetURL}</a></p>

      <p style="color: #718096; font-size: 12px;">This link will expire in 1 hour. If you didn’t request a password reset, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="text-align: center; color: #718096; font-size: 12px;">Your App Team</p>
    </div>
  `
});


    res.status(200).json({ message: "Password reset email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------- RESET PASSWORD ----------
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if (!token || !newPassword)
      return res.status(400).json({ message: "Token and new password required" });

    // 🔹 Hash token to match DB
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const redirectResetPassword = async (req, res) => {
  const token = req.params.token;
  if (!token) return res.status(400).send("Token missing");

  res.redirect(`${process.env.FRONTEND_URL}/reset-password/${token}`);
};


const signup = async (req, res) => {
  try {
    const { name, lastname, mobileno, emailaddress, password, gender, dob } = req.body;

    if (!name || !lastname || !mobileno || !emailaddress || !password || !gender || !dob) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ emailaddress });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, lastname, mobileno, emailaddress, password: hashedPassword, gender, dob });
    await newUser.save();

    // Automatically create user profile
    const UserProfile = require("../models/UserProfile");
    await UserProfile.create({
      user: newUser._id,
      name: newUser.name,
      profilePhoto: "", // default empty
    });

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: newUser 
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


const login = async (req, res) => {
  try {
    const { emailaddress, password } = req.body;
    const user = await User.findOne({ emailaddress: emailaddress });

    if (!user) {
      return res.status(400).json({ message: "Try Again" });
    }

   
    if (user.isActive === false) {
      return res.status(403).json({ message: "Your account is deactivated" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password Wrong" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        emailaddress: user.emailaddress,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



const getAllUsers = async (req, res) => {
  try {

    const users = await User.find();
    res.status(200).json({ users });
  }
  catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users", error: err });

  }


};
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: `User has been ${isActive ? "activated" : "deactivated"}`,
      user,
    });
  } catch (err) {
  
    res.status(500).json({ message: "Failed to update user status" });
  }
};




module.exports = { signup, login, getAllUsers, updateUserStatus,resetPassword,forgotPassword,redirectResetPassword  };
