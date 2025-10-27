const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  address: { type: String, required: true },
  problem: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Service', servicesSchema);
