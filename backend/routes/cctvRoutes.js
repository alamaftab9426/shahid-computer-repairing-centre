const express = require("express");
const router = express.Router();
const upload = require("../middleware/cctvUpload");
const { createCctv , getCctv,updateCctv, deleteCctv} = require("../controllers/cctvController");
const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");

router.post("/cctv",verifyToken, verifyAdminToken, upload.single("image"), createCctv);
router.get("/cctv", getCctv); 
router.put("/cctv/:id",verifyToken, verifyAdminToken, upload.single("image"), updateCctv);
router.delete("/cctv/:id",verifyToken, verifyAdminToken, deleteCctv);

module.exports = router