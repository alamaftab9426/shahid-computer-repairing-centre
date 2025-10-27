const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  cancelOrderByUser,
  cancelOrderByAdmin,
  updateOrderStatus 
} = require("../controllers/orderController");

const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");

// Place order
router.post("/placeorder", verifyToken, placeOrder);

// Get orders
router.get("/myorders", verifyToken, getUserOrders);
router.get("/allorders", verifyAdminToken, getAllOrders);
router.put("/status/:orderId", verifyAdminToken,updateOrderStatus)

// Cancel orders
router.put("/cancel/user/:orderId", verifyToken, cancelOrderByUser);
router.put("/cancel/admin/:orderId", verifyAdminToken, cancelOrderByAdmin);

// Delete order (admin only)
router.delete("/:orderId", verifyAdminToken, deleteOrder);

module.exports = router;
