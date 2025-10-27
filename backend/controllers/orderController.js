const Order = require("../models/Order");
const Laptop = require("../models/Laptop");
const Cctv = require("../models/Cctv");

// Place Order (User)
exports.placeOrder = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user_id = req.user.id;

    const { laptops = [], cctvs = [], paymentMethod, deliveryAddress } = req.body;

    if ((!laptops || laptops.length === 0) && (!cctvs || cctvs.length === 0)) {
      return res.status(400).json({ message: "No products selected" });
    }

    if (!deliveryAddress || !deliveryAddress.fullname || !deliveryAddress.address) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    let totalAmount = 0;

    // Laptop items
    const laptopItems = await Promise.all(
      laptops.map(async (item) => {
        if (!item.productId) throw new Error("Laptop productId missing");
        const laptop = await Laptop.findById(item.productId);
        if (!laptop) throw new Error(`Laptop not found: ${item.productId}`);

        const quantity = item.quantity || 1;
        const priceAfterDiscount = laptop.price - (laptop.discount || 0);
        totalAmount += priceAfterDiscount * quantity;

        return {
          productId: laptop._id,
          subcategory: laptop.subcategory,
          title: laptop.title,
          price: laptop.price,
          description: laptop.description,
          discount: laptop.discount,
          processorType: laptop.processorType,
          disk: laptop.disk,
          ram: laptop.ram,
          generation: laptop.generation,
          image: laptop.image,
          quantity,
        };
      })
    );

    // CCTV items
    const cctvItems = await Promise.all(
      cctvs.map(async (item) => {
        if (!item.productId) throw new Error("CCTV productId missing");
        const cctv = await Cctv.findById(item.productId);
        if (!cctv) throw new Error(`CCTV not found: ${item.productId}`);

        const quantity = item.quantity || 1;
        const priceAfterDiscount = cctv.price - (cctv.discount || 0);
        totalAmount += priceAfterDiscount * quantity;

        return {
          productId: cctv._id,
          subcategory: cctv.subcategory,
          title: cctv.title,
          price: cctv.price,
          discount: cctv.discount,
          quantity,
          image: cctv.image,
        };
      })
    );

    const order = new Order({
      user_id,
      deliveryAddress,
      laptops: laptopItems,
      cctvs: cctvItems,
      totalAmount,
      paymentMethod,
      status: "pending", 
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("PlaceOrder Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get user orders (User panel)
exports.getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user_id = req.user.id;

    const orders = await Order.find({ user_id })
      .populate("laptops.productId")
      .populate("cctvs.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("GetUserOrders Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get All User By Admin
exports.getAllOrders = async (req, res) => {
  try {
    
    const orders = await Order.find()
      .populate("laptops.productId")
      .populate("cctvs.productId")
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });
      
    res.status(200).json({ orders });
  } catch (error) {
    console.error("GetAllOrders Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update order status (Admin only)

exports.updateOrderStatus = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatus = ["pending", "confirmed", "shipped", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    let order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    order = await Order.findById(orderId).populate("user_id", "name email");

   
    const io = req.app.get("io");
    io.emit(`orderUpdated-${order.user_id}`, order);

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("UpdateOrderStatus Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional: only allow deleting cancelled orders
    if (order.status !== "cancelled") {
      return res.status(400).json({ message: "Only cancelled orders can be deleted" });
    }

    await order.deleteOne(); // delete from DB

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelOrderByUser = async (req, res) => {
  try {
    const { orderId } = req.params; // matches route
    const userId = req.user.id;

    const order = await Order.findOne({ _id: orderId, user_id: userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "completed") return res.status(400).json({ message: "Cannot cancel completed order" });

    order.status = "cancelled";
    order.cancelledBy = "user";
    await order.save();

    res.json({ message: "Order cancelled by you", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.cancelOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params; // matches route
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "completed") return res.status(400).json({ message: "Cannot cancel completed order" });

    order.status = "cancelled";
    order.cancelledBy = "admin";
    await order.save();

    res.json({ message: "Order cancelled by admin", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

