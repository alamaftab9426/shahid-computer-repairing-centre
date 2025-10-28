const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);
});

app.set("io", io);

//  Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/serviceRoute");
const laptopRoutes = require("./routes/LaptopRoute");
const cctvRoutes = require("./routes/cctvRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const userAddressRoutes = require("./routes/userAddressRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/user", userAddressRoutes);
app.use("/api/user", userProfileRoutes);
app.use("/api", laptopRoutes);
app.use("/api", cctvRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

//  Database connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    const PORT = process.env.PORT || 5000;
    //  Important: use `server.listen`, not `app.listen`
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB Error:", err));
