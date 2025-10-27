const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken")
const {
  createService,
  getAllServices,
  updateStatus,
  deleteService,
} = require("../controllers/serviceController");


router.post("/", verifyToken, createService);


router.get("/", verifyToken, verifyAdminToken, getAllServices);


router.put("/:id",verifyToken,verifyAdminToken, updateStatus);

router.delete("/:id",verifyToken,verifyAdminToken, deleteService);

module.exports = router;
