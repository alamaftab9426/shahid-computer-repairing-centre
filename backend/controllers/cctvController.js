const Cctv = require("../models/Cctv");

// Create CCTV
exports.createCctv = async (req, res) => {
  try {
    const {
      subcategory,
      title,
      price,
      discount,
      description
    } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newCctv = new Cctv({
      subcategory,
      title,
      price,
      discount,
      description,

      image: `uploads/cctv/${req.file.filename}`,
    });

    await newCctv.save();

    res.status(201).json({
      success: true,
      message: "CCTV product created successfully",
      data: newCctv,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while saving CCTV",
      error: error.message,
    });
  }
};


exports.getCctv = async (req, res) => {
  try {
    const cctvs = await Cctv.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: cctvs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCctv = async (req, res) => {
  try {
    const {
      subcategory,
      title,
      price,
      discount,
      description
    } = req.body;

    let updateData = {
      subcategory,
      title,
      price,
      discount,
      description
      
    };
    if (req.file) {
      updateData.image = `uploads/cctv/${req.file.filename}`;
    }

    const updatedCctv = await Cctv.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCctv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.deleteCctv = async (req, res) => {
  try {
    const deleted = await Cctv.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
