const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});
app.set("io", io);

// ✅ CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://luxury-alfajores-7049a1.netlify.app", // your Netlify frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `This site ${origin} does not have access.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
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
  res.send("Server is running...");
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(" MongoDB Error:", err));
