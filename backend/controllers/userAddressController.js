
const UserAddress = require("../models/UserAddress")

exports.addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullname, mobile, city, pincode, state, country, address } = req.body
        const newAddress = new UserAddress({
            user_id: userId,
            fullname,
            mobile,
            city,
            pincode,
            state,
            country,
            address,

        })
        await newAddress.save();
        res.status(201).json({ massage: "Address Saved successfully", address: newAddress });
    }
    catch (err) {
        res.status(500).json({ err: err })

    }

}

exports.getAddresses = async (req, res) => {
  try {
    let addresses;
    if (req.user.role === "admin") {      
      addresses = await UserAddress.find().populate("user_id", "name email");
    } else {
      
      addresses = await UserAddress.find({ user_id: req.user.id });
    }
    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (err) {
    res.status(500).json({ err });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params; 
    const address = await UserAddress.findById(id);

    if (!address) return res.status(404).json({ message: "Address Not Found" });

    if (req.user.role !== "admin" && address.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    Object.assign(address, req.body);
    await address.save();

    res.status(200).json({ message: "Address Updated Successfully", address });
  } catch (err) {
    res.status(500).json({ err });
  }
};


exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await UserAddress.findById(id);

    if (!address) return res.status(404).json({ message: "Address Not Found" });

    // Normal user can delete only their own address
    if (req.user.role !== "admin" && address.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await address.deleteOne();
    res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ err });
  }
};

