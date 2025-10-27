const mongoose = require("mongoose");

const LaptopSchema = new mongoose.Schema({
   subcategory: {
    type: String,
    required: true, 
    enum: ["dell", "hp", "apple","asus", "acer","lenovo","sumsung"],
  },
  title: { 
    type: String,
     required: true 
    },
  price:
   { type: Number, 
    required: true
   },
  description:
   { type: String,
     required: true
     },
  discount: 
  { type: Number, 
    default: 0 
  },
  processorType: 
  { type: String,
     required: true
     },
  disk: 
  { type: String, 
    required: true
   },
  ram: 
  { type: String,
     required: true
     },
  generation:
   { type: String,
     required: true
     },
  image:
   { type: String, 
    required: true 
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Laptop", LaptopSchema);
