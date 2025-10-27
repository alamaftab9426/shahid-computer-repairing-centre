import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";

const statusSteps = ["pending", "confirmed", "shipped", "completed", "cancelled"];
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${BASE_URL}/api/order/allorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.orders || []);
      } catch (err) {
        toast.error("Failed to fetch orders", { position: "top-center", theme: "dark", transition: Bounce });
      }
    };
    fetchOrders();
  }, []);

  // Update status (admin)
  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      // NOTE: route must exist on server: router.put("/status/:orderId", ...)
      const { data } = await axios.put(
        `${BASE_URL}/api/order/status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update local state (both list and modal if open)
      setOrders((prev) => prev.map((order) => (order._id === orderId ? data.order : order)));
      if (selectedOrder?._id === orderId) setSelectedOrder(data.order);

      toast.success(`Order status updated to ${newStatus.toUpperCase()}`, {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    } catch (err) {
      console.error("updateStatus error:", err?.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update status", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Delete cancelled order (admin)
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders((prev) => prev.filter((o) => o._id !== orderId));
      if (selectedOrder?._id === orderId) setSelectedOrder(null);

      toast.success("Cancelled order deleted successfully", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    } catch (err) {
      console.error("deleteOrder error:", err?.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to delete order", {
        position: "top-center",
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  // Cancel order as admin (calls cancel/admin route)
  const handleAdminCancel = async (orderId) => {
    const confirm = await Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order for the user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${BASE_URL}/api/order/cancel/admin/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // update UI
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled", cancelledBy: "admin" } : o))
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: "cancelled", cancelledBy: "admin" } : prev));
      }

      Swal.fire("Cancelled!", res.data.message || "Order has been cancelled by admin.", "success");
    } catch (err) {
      console.error("handleAdminCancel error:", err?.response?.data || err.message);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  const getImageUrl = (item, type) => {
    if (!item || !item.image) return "";
    let folder = "products";
    const finalType = type || (item.productType || "").toLowerCase();
    if (finalType === "laptop") folder = "laptops";
    else if (finalType === "cctv") folder = "cctv";
    if (!item.image.startsWith("http")) {
      const cleanImage = item.image.replace(/^\/?uploads\/(laptops|cctv|products)\//, "");
      return `${BASE_URL}/uploads/${folder}/${cleanImage}`;
    }
    return item.image;
  };

  const handlePrint = () => {
    if (!selectedSlipOrder) return;
    const printWindow = window.open("", "_blank", "width=900,height=700");
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #999; padding: 8px; }
            th { background-color: #f3f3f3; font-weight: bold; }
            td.text-right { text-align: right; }
            td.text-center { text-align: center; }
            h2 { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h2>Order Invoice</h2>
          <div>
            <p><strong>Customer:</strong> ${selectedSlipOrder.user_id?.name}</p>
            <p><strong>Mobile:</strong> ${selectedSlipOrder.deliveryAddress.mobile}</p>
            <p><strong>Address:</strong> ${selectedSlipOrder.deliveryAddress.address}, ${selectedSlipOrder.deliveryAddress.city}, ${selectedSlipOrder.deliveryAddress.state} - ${selectedSlipOrder.deliveryAddress.pincode}</p>
            <p><strong>Order ID:</strong> ${selectedSlipOrder._id}</p>
            <p><strong>Date:</strong> ${new Date(selectedSlipOrder.createdAt).toLocaleDateString()}</p>
            <p><strong>Payment:</strong> ${selectedSlipOrder.paymentMethod.toUpperCase()}</p>
            <p><strong>Status:</strong> ${selectedSlipOrder.status.toUpperCase()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedSlipOrder.laptops.concat(selectedSlipOrder.cctvs).map(p => {
                const price = p.discount ? p.price - (p.price * p.discount) / 100 : p.price;
                return `
                  <tr>
                    <td>${p.title}</td>
                    <td style="text-align:center">${p.quantity}</td>
                    <td style="text-align:right">₹${price}</td>
                    <td style="text-align:right; font-weight:bold">₹${price * p.quantity}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>

          <div style="margin-top: 15px; display:flex; justify-content: space-between; font-weight:bold">
            <span>Total Items: ${selectedSlipOrder.laptops.length + selectedSlipOrder.cctvs.length}</span>
            <span>Total Amount: ₹${selectedSlipOrder.totalAmount}</span>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Orders Panel</h1>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "shipped", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full font-medium shadow ${filterStatus === status ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => setFilterStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-sm shadow-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-zinc-950">
            <tr>
              {["Order ID", "User", "Items", "Total", "Payment", "Status", "Actions"].map((head) => (
                <th
                  key={head}
                  className={`px-6 py-4 text-base font-bold tracking-wider ${head === "Status" ? "text-center" : "text-left"} text-gray-200`}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 font-medium">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">{order._id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.user_id?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{(order.laptops?.length || 0) + (order.cctvs?.length || 0)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₹{order.totalAmount?.toLocaleString?.()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.paymentMethod?.toUpperCase?.()}</td>
                  <td className="px-6 py-4 text-sm text-center">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : order.status === "confirmed"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "shipped"
                            ? "bg-indigo-200 text-indigo-800"
                            : order.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                        }`}
                    >
                      {order.status?.toUpperCase?.()}
                    </span>
                  </td>
                  {/* Actions Column */}
                  <td className="px-6 py-4 text-sm flex gap-2 items-center">

                    {order.status === "cancelled" && (
                      <FiTrash2
                        className="text-red-600 cursor-pointer hover:text-red-800 transition"
                        size={18}
                        onClick={() => deleteOrder(order._id)}
                        title="Delete Order"
                      />
                    )}

                    {/* Status Button */}
                    <button
                      className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition flex items-center gap-1 font-medium"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Status
                    </button>

                    {/* Slip Button */}
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition flex items-center gap-1 font-medium"
                      onClick={() => setSelectedSlipOrder(order)}
                    >
                      Slip
                    </button>

                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-sm shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button
                  className="text-gray-500 hover:text-gray-800 text-2xl font-bold transition"
                  onClick={() => setSelectedOrder(null)}
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
                {/* Delivery Info */}
                <div className="flex justify-between bg-gray-50">
                  <div className="p-3 rounded-lg flex flex-col gap-1 text-sm">
                    <h3 className="font-semibold text-gray-700">Delivery Address</h3>
                    <p><span className="font-medium">Fullname:</span> {selectedOrder.deliveryAddress?.fullname}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedOrder.deliveryAddress?.mobile}</p>
                    <p><span className="font-medium">Address:</span> {`${selectedOrder.deliveryAddress?.address || ""}, ${selectedOrder.deliveryAddress?.city || ""}, ${selectedOrder.deliveryAddress?.state || ""} - ${selectedOrder.deliveryAddress?.pincode || ""}, ${selectedOrder.deliveryAddress?.country || ""}`}</p>
                  </div>
                  <div className="p-3 rounded-lg flex flex-col gap-1 text-sm">
                    <p><span className="font-medium">Total Items:</span> {(selectedOrder.laptops?.length || 0) + (selectedOrder.cctvs?.length || 0)}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{selectedOrder.totalAmount}</p>
                    <p><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod?.toUpperCase?.()}</p>
                    <p><span className="font-medium">Status:</span> {selectedOrder.status?.toUpperCase?.()}</p>
                  </div>
                </div>

                {/* Status Update Section */}
                <div className="flex flex-col gap-3 text-sm">
                  <h3 className="font-semibold text-gray-700 text-sm">Update Order Status</h3>
                  <div className="flex gap-2 flex-wrap">
                    {statusSteps.map((step) => (
                      <button
                        key={step}
                        className="px-3 py-1 rounded-full border border-gray-400 text-xs font-medium hover:bg-gray-100 transition"
                        onClick={() => updateStatus(selectedOrder._id, step)}
                        disabled={selectedOrder.status === "cancelled"}
                        title={selectedOrder.status === "cancelled" ? "Order is cancelled" : `Set status to ${step}`}
                      >
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </button>
                    ))}
                    {/* Admin Cancel button */}
                    {selectedOrder.status !== "cancelled" && (
                      <button
                        onClick={() => handleAdminCancel(selectedOrder._id)}
                        className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition"
                      >
                        Cancel Order (Admin)
                      </button>
                    )}
                  </div>

                  {/* Timeline / Progress Bar OR Cancelled Message */}
                  {selectedOrder.status === "cancelled" ? (
                    <div className="w-full p-6 bg-red-50 rounded text-center border border-red-200">
                      <h3 className="text-lg font-semibold text-red-700">Order Cancelled</h3>
                      <p className="text-sm text-red-600 mt-2">This order has been cancelled{selectedOrder.cancelledBy ? ` by ${selectedOrder.cancelledBy}` : ""}.</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-start mt-4 px-2">
                      {statusSteps.slice(0, -1).map((step, idx) => {
                        // use index of current status among steps without 'cancelled'
                        const currentStep = statusSteps.indexOf(selectedOrder.status);
                        const isCompleted = idx <= currentStep;
                        return (
                          <div key={step} className="flex flex-col items-start flex-1 relative">
                            <motion.div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 text-sm border-2 relative ${isCompleted ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-400"}`}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: idx === currentStep ? [1, 1.2, 1] : 1 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                              {idx + 1}
                            </motion.div>

                            <span className={`text-xs mt-2 ${isCompleted ? "text-blue-600" : "text-gray-500"} text-left`}>
                              {step.charAt(0).toUpperCase() + step.slice(1)}
                            </span>

                            {idx < statusSteps.length - 2 && (
                              <div className="absolute top-5 left-10 h-1 w-full bg-gray-300">
                                <div className="h-1 bg-blue-600" style={{ width: idx < currentStep ? "100%" : "0%" }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Products Grid */}
                <div className="bg-gray-50 p-3 rounded-lg flex-1">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm">Products</h3>
                  <div className="max-h-64 overflow-y-auto pr-2 flex flex-col gap-2">
                    {(selectedOrder.laptops || []).map((p, idx) => (
                      <div key={`laptop-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img src={getImageUrl(p, "laptop")} alt={p.title || "Laptop"} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="flex-1 mx-4 flex flex-col justify-between">
                          <p className="font-semibold text-gray-800">{p.title}</p>
                          <div className="text-gray-600 text-xs space-y-0.5">
                            {p.processorType && <p>Processor: {p.processorType}</p>}
                            {p.ram && <p>RAM: {p.ram}</p>}
                            {p.disk && <p>Disk: {p.disk}</p>}
                            {p.generation && <p>Gen: {p.generation}</p>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between text-right">
                          <p className="text-gray-700 text-sm">Qty: {p.quantity}</p>
                          <p className="font-semibold text-gray-900 text-sm">₹{p.discount ? p.price - (p.price * p.discount) / 100 : p.price}</p>
                        </div>
                      </div>
                    ))}

                    {(selectedOrder.cctvs || []).map((p, idx) => (
                      <div key={`cctv-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition">
                        <div className="flex-shrink-0 w-20 h-20">
                          <img src={getImageUrl(p, "cctv")} alt={p.title || "CCTV"} className="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div className="flex-1 mx-4 flex flex-col justify-between">
                          <p className="font-semibold text-gray-800">{p.title}</p>
                          {p.description && <p className="text-gray-600 text-xs">{p.description}</p>}
                        </div>
                        <div className="flex flex-col items-end justify-between text-right">
                          <p className="text-gray-700 text-sm">Qty: {p.quantity}</p>
                          <p className="font-semibold text-gray-900 text-sm">₹{p.discount ? p.price - (p.price * p.discount) / 100 : p.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slip Modal (same as before) */}
      <AnimatePresence>
        {selectedSlipOrder && (
          <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Order Slip</h2>
                <button className="text-gray-500 hover:text-gray-800 text-2xl font-bold transition" onClick={() => setSelectedSlipOrder(null)}>×</button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p><span className="font-medium">Customer:</span> {selectedSlipOrder.user_id?.name}</p>
                    <p><span className="font-medium">Mobile:</span> {selectedSlipOrder.deliveryAddress?.mobile}</p>
                    <p><span className="font-medium">Address:</span> {`${selectedSlipOrder.deliveryAddress?.address || ""}, ${selectedSlipOrder.deliveryAddress?.city || ""}, ${selectedSlipOrder.deliveryAddress?.state || ""} - ${selectedSlipOrder.deliveryAddress?.pincode || ""}, ${selectedSlipOrder.deliveryAddress?.country || ""}`}</p>
                  </div>
                  <div className="text-right">
                    <p><span className="font-medium">Order ID:</span> {selectedSlipOrder._id}</p>
                    <p><span className="font-medium">Date:</span> {new Date(selectedSlipOrder.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Payment:</span> {selectedSlipOrder.paymentMethod?.toUpperCase?.()}</p>
                    <p><span className="font-medium">Status:</span> {selectedSlipOrder.status?.toUpperCase?.()}</p>
                  </div>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 border-b border-gray-300 text-left">Item</th>
                        <th className="px-3 py-2 border-b border-gray-300 text-center">Qty</th>
                        <th className="px-3 py-2 border-b border-gray-300 text-right">Unit Price</th>
                        <th className="px-3 py-2 border-b border-gray-300 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedSlipOrder.laptops || []).map((p, idx) => (
                        <tr key={`laptop-${idx}`} className="hover:bg-gray-50">
                          <td className="px-3 py-2 border-b border-gray-200">{p.title}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-center">{p.quantity}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-right">₹{p.discount ? p.price - (p.price * p.discount) / 100 : p.price}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-right font-semibold">₹{(p.discount ? p.price - (p.price * p.discount) / 100 : p.price) * p.quantity}</td>
                        </tr>
                      ))}
                      {(selectedSlipOrder.cctvs || []).map((p, idx) => (
                        <tr key={`cctv-${idx}`} className="hover:bg-gray-50">
                          <td className="px-3 py-2 border-b border-gray-200">{p.title}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-center">{p.quantity}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-right">₹{p.discount ? p.price - (p.price * p.discount) / 100 : p.price}</td>
                          <td className="px-3 py-2 border-b border-gray-200 text-right font-semibold">₹{(p.discount ? p.price - (p.price * p.discount) / 100 : p.price) * p.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center border-t p-4 bg-gray-50">
                <div className="text-sm font-medium">Total Items: {(selectedSlipOrder.laptops?.length || 0) + (selectedSlipOrder.cctvs?.length || 0)}</div>
                <div className="flex items-center gap-4">
                  <div className="text-right font-bold text-gray-800">Total: ₹{selectedSlipOrder.totalAmount}</div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition font-medium" onClick={handlePrint}>Print</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  );
};

export default AdminOrders;
