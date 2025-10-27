const express = require('express');
const {addAddress,getAddresses,updateAddress, deleteAddress} =  require("../controllers/userAddressController")
const verifyToken = require('../middleware/verifyToken');
const verifyAdminToken = require('../middleware/verifyAdminToken')

const router = express.Router();

router.post("/placeorder", verifyToken, addAddress);
router.get("/placeorder", verifyToken, getAddresses);
router.put("/placeorder/:id", verifyToken,updateAddress);
router.delete("/placeorder/:id", verifyToken, deleteAddress)


module.exports = router;