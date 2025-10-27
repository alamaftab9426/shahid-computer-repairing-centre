const Service = require("../models/Service");

const { sendStatusUpdateEmail } = require("../utils/mail")

// Create a new service request (User)
exports.createService = async (req, res) => {
  try {
    const { name, email, service, address, problem } = req.body;

    if (!name || !email || !service || !address || !problem) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newService = new Service({
      name,
      email,
      service,
      address,
      problem,
    });

    await newService.save();

    res
      .status(201)
      .json({ message: "Service successfully submitted", data: newService });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};



// Get All Requests (Admin side)
exports.getAllServices = async (req, res) => {
  try {
    const requests = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



// Update service status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Service.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Service not found" });

    
    await sendStatusUpdateEmail(
      updated.email,   
      updated.name,    
      updated.service, 
      updated.status   
    );

    res.status(200).json({ message: "Status updated and email sent", updated });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete a service request (Admin)
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Service request not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
