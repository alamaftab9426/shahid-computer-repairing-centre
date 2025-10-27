// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

//  Setup Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});
app.set("io", io);

// Allowed origins (from .env FRONTEND_URL)
const allowedOrigins = process.env.FRONTEND_URL.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed for this origin: " + origin), false);
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoute");
const LaptopRoutes = require("./routes/LaptopRoute");
const CctvRoutes = require("./routes/cctvRoutes");
const UserProfileRoutes = require("./routes/userProfileRoutes");
const userAddress = require("./routes/userAddressRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userAddress);
app.use("/api/user", UserProfileRoutes);
app.use("/api", LaptopRoutes);
app.use("/api", CctvRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running...");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));
