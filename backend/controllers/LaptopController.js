const Laptop = require("../models/Laptop");

// CREATE LAPTOP
exports.createLaptop = async (req, res) => {
  try {
    const {
      subcategory,
      title,
      price,
      description,
      discount,
      processorType,
      disk,
      ram,
      generation,
    } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const newLaptop = new Laptop({
      subcategory,
      title,
      price,
      description,
      discount,
      processorType,
      disk,
      ram,
      generation,
      image: `uploads/laptops/${req.file.filename}`, 
    });

    await newLaptop.save();

    res.status(201).json({
      success: true,
      message: "Laptop created successfully",
      data: newLaptop,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while saving Laptop",
      error: error.message,
    });
  }
};

// GET ALL LAPTOPS
exports.getLaptop = async (req, res) => {
  try {
    const laptops = await Laptop.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: laptops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLaptop = async (req, res) => {
  try {
    const {
      subcategory,
      title,
      price,
      description,
      discount,
      processorType,
      disk,
      ram,
      generation,
    } = req.body;

    const updatedData = {
      subcategory,
      title,
      price,
      description,
      discount,
      processorType,
      disk,
      ram,
      generation,
    };

    if (req.file) {
      updatedData.image = `uploads/laptops/${req.file.filename}`; 
    }

    const updateLaptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updateLaptop) {
      return res
        .status(404)
        .json({ success: false, message: "Laptop not found" });
    }

    res.status(200).json({
      success: true,
      message: "Laptop updated successfully",
      data: updateLaptop,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE LAPTOP
exports.deleteLaptop = async (req, res) => {
  try {
    const deleted = await Laptop.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Laptop not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Laptop deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
