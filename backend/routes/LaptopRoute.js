const express = require("express");
const router = express.Router();
const upload = require("../middleware/laptopUpload");
const { createLaptop, getLaptop, updateLaptop, deleteLaptop } = require("../controllers/LaptopController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");

router.post("/laptop",verifyToken, verifyAdminToken, upload.single("image"), createLaptop);
router.get("/laptop", getLaptop);
router.put("/laptop/:id",verifyToken, verifyAdminToken, upload.single("image"), updateLaptop);
router.delete("/laptop/:id",verifyToken, verifyAdminToken, deleteLaptop);

module.exports = router;
