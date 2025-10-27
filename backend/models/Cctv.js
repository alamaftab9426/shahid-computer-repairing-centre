const mongoose = require("mongoose");

const cctvSchema = new mongoose.Schema({
  subcategory: {
    type: String,
    required: true, 
    enum: ["camera", "harddisk", "cable", "service"],
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Cctv", cctvSchema);
