const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     deliveryAddress: {
      fullname: { type: String, required: true },
      mobile: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, required: true },

    },

    laptops: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Laptop",
          required: true,
        },
        subcategory: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        discount: { type: Number, default: 0 },
        processorType: { type: String, required: true },
        disk: { type: String, required: true },
        ram: { type: String, required: true },
        generation: { type: String, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, default: 1 }, 
      },
    ],

    cctvs: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cctv",
          required: true,
        },
        subcategory: { type: String, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        image: { type: String },
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "completed", "cancelled"],
      default: "pending",
    },
    cancelledBy: { type: String, enum: ["admin", "user", null], default: null }, // new field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
