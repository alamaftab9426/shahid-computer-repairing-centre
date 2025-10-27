import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Swal from "sweetalert2";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_URL;

const stepMap = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  completed: 3,
  delivered: 3,
};

const steps = ["Pending", "Confirmed", "Shipped", "Completed"];

// Progress Bar Component
const ProgressBar = ({ currentStep }) => {
  const totalSteps = steps.length;
  const progressWidth =
    currentStep === 0 ? "0%" : `${(currentStep / (totalSteps - 1)) * 100}%`;

  return (
    <div className="relative my-4">
      <div className="absolute top-3.5 left-0 w-full h-0.5 bg-gray-300 rounded"></div>
      <motion.div
        className="absolute top-3.5 left-0 h-0.5 bg-red-700 rounded"
        initial={{ width: 0 }}
        animate={{ width: progressWidth }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          return (
            <div key={index} className="flex flex-col items-center relative w-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 relative z-10 ${isCompleted || isActive
                  ? "bg-red-700 border-red-700 text-white"
                  : "bg-white border-gray-400 text-gray-500"
                  }`}
              >
                {isCompleted ? <FiCheck className="text-white" /> : index + 1}
              </div>

              {isActive && (
                <motion.div
                  className="absolute w-10 h-10 rounded-full bg-red-400 opacity-20"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}

              <span
                className={`text-xs mt-1 text-center ${isCompleted || isActive ? "text-red-700 font-semibold" : "text-gray-400"
                  }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const AllOrders = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);


  const handleCancel = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${BASE_URL}/api/order/cancel/user/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", res.data.message, "success");

      // Update local state with cancelledBy
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: "cancelled", cancelledBy: "user" }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };


  const getImageUrl = (item, type) => {
    if (!item || !item.image) return "";
    let folder = type || (item.productType || "").toLowerCase();
    if (folder === "laptop") folder = "laptops";
    else if (folder === "cctv") folder = "cctv";
    if (!item.image.startsWith("http")) {
      const cleanImage = item.image.replace(/^\/?uploads\/(laptops|cctv|products)\//, "");
      return `${BASE_URL}/uploads/${folder}/${cleanImage}`;
    }
    return item.image;
  };




  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p>No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900/90 border border-zinc-800 rounded-sm p-2 md:p-8 backdrop-blur-md">
      <h1 className="text-xl font-extrabold text-white  mb-3 md:mb-8 text-center tracking-wide">
        Your All Orders
      </h1>



      {isMobile ? (
        //  Mobile Card Layout
        <div className="flex flex-col gap-3">
          {orders.map((order, orderIdx) => {
            const items = [...(order.laptops || []), ...(order.cctvs || [])];

            return (
              <div
                key={order._id}
                className="bg-zinc-900 rounded-lg px-6 py-6 border border-gray-700 text-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                  <h2 className="text-zinc-300 font-semibold text-sm">
                    Your {orderIdx + 1} Order
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "pending"
                      ? "bg-orange-500 text-white"
                      : order.status === "confirmed"
                        ? "bg-green-500 text-white"
                        : order.status === "shipped"
                          ? "bg-blue-500 text-white"
                          : order.status === "completed" || order.status === "delivered"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-600 text-white"
                      }`}
                  >
                    {order.status === "cancelled"
                      ? order.cancelledBy === "admin"
                        ? "Cancelled by admin"
                        : "Cancelled by you"
                      : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>

                </div>

                {/* Items Cards */}
                <div className="flex flex-col gap-4">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-800 rounded-md border border-gray-700 p-4 flex flex-col gap-3"
                    >
                      {/* Image on top */}
                      <div className="w-full h-40 sm:h-24 flex-shrink-0 border border-gray-600 rounded-sm overflow-hidden mb-3">
                        {order.laptops
                          .filter((p) => p._id === item._id)
                          .map((p, i) => (
                            <img
                              key={`laptop-${i}`}
                              src={getImageUrl(p, "laptop")}
                              alt={p.title || "Laptop"}
                              className="w-full h-full object-cover"
                            />
                          ))}
                        {order.cctvs
                          .filter((p) => p._id === item._id)
                          .map((p, i) => (
                            <img
                              key={`cctv-${i}`}
                              src={getImageUrl(p, "cctv")}
                              alt={p.title || "CCTV"}
                              className="w-full h-full object-cover"
                            />
                          ))}
                      </div>

                      {/* Mini Table */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-200">
                        <span className="font-semibold">Title:</span>
                        <span>{item.title}</span>

                        <span className="font-semibold">Processor:</span>
                        <span>{item.processorType || "-"}</span>

                        <span className="font-semibold">RAM:</span>
                        <span>{item.ram || "-"}</span>

                        <span className="font-semibold">Disk:</span>
                        <span>{item.disk || "-"}</span>

                        <span className="font-semibold">Gen:</span>
                        <span>{item.generation || "-"}</span>

                        <span className="font-semibold">Description:</span>
                        <span className="truncate">{item.description || "-"}</span>

                        <span className="font-semibold">Quantity:</span>
                        <span>{item.quantity}</span>

                        <span className="font-semibold">Price:</span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}

                </div>

                {/* Progress */}
                {/* Progress or Cancelled Message */}
                {order.status === "cancelled" ? (
                  <div className="text-red-500 font-semibold mt-4 text-center">
                    Your order is cancelled by you
                  </div>
                ) : (
                  <ProgressBar currentStep={stepMap[order.status] || 0} />
                )}


                {/* Actions */}
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-red-500 font-medium text-sm"
                    disabled={order.status === "cancelled"}
                  >
                    Cancel
                  </button>
                  <button className="flex items-center gap-1 text-zinc-300 font-medium text-sm hover:text-red-500">
                    Track Order
                  </button>
                </div>
              </div>
            );

          })}
        </div>
      ) : (

        // Desktop Table Layout
        <div className="flex flex-col gap-6">
          {orders.map((order, orderIdx) => {
            const items = [...(order.laptops || []), ...(order.cctvs || [])];

            return (
              <div
                key={order._id}
                className="bg-zinc-900 rounded-sm px-6 border py-7"
              >
                {/* Order Header */}
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                  <h2 className="text-zinc-300 font-semibold text-sm">
                    Your {orderIdx + 1} Order
                  </h2>
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium ${order.status === "pending"
                      ? "bg-orange-500 text-white"
                      : order.status === "confirmed"
                        ? "bg-green-500 text-white"
                        : order.status === "shipped"
                          ? "bg-blue-500 text-white"
                          : order.status === "completed" || order.status === "delivered"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-600 text-white"
                      }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-gray-700 text-zinc-200">
                    <thead className="bg-zinc-800 text-zinc-100">
                      <tr>
                        <th className="p-2 border border-gray-700">Image</th>
                        <th className="p-2 border border-gray-700">Title</th>
                        <th className="p-2 border border-gray-700">Processor</th>
                        <th className="p-2 border border-gray-700">RAM</th>
                        <th className="p-2 border border-gray-700">Disk</th>
                        <th className="p-2 border border-gray-700">Gen</th>
                        <th className="p-2 border border-gray-700">Description</th>
                        <th className="p-2 border border-gray-700">Quantity</th>
                        <th className="p-2 border border-gray-700">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-zinc-900">
                          {/* Image */}
                          <td className="p-2 border border-gray-700 w-20 h-20">
                            {order.laptops
                              .filter((p) => p._id === item._id)
                              .map((p, i) => (
                                <div
                                  key={`laptop-${i}`}
                                  className="w-20 h-20 border border-gray-700 rounded-sm overflow-hidden"
                                >
                                  <img
                                    src={getImageUrl(p, "laptop")}
                                    alt={p.title || "Laptop"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            {order.cctvs
                              .filter((p) => p._id === item._id)
                              .map((p, i) => (
                                <div
                                  key={`cctv-${i}`}
                                  className="w-20 h-20 border border-gray-700 rounded-sm overflow-hidden"
                                >
                                  <img
                                    src={getImageUrl(p, "cctv")}
                                    alt={p.title || "CCTV"}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                          </td>

                          {/* Title */}
                          <td className="p-2 border border-gray-700">{item.title}</td>
                          <td className="p-2 border border-gray-700">
                            {item.processorType || "-"}
                          </td>
                          <td className="p-2 border border-gray-700">{item.ram || "-"}</td>
                          <td className="p-2 border border-gray-700">{item.disk || "-"}</td>
                          <td className="p-2 border border-gray-700">
                            {item.generation || "-"}
                          </td>
                          <td className="p-2 border border-gray-700">
                            {item.description || "-"}
                          </td>
                          <td className="p-2 border border-gray-700">{item.quantity}</td>
                          <td className="p-2 border border-gray-700 font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>

                {/* Progress */}
                {/* Progress or Cancelled Message */}
                {order.status === "cancelled" ? (
                  <div className="text-red-500 font-semibold mt-4 text-center">
                    Your order is cancelled by you
                  </div>
                ) : (
                  <ProgressBar currentStep={stepMap[order.status] || 0} />
                )}


                {/* Actions */}
                <div className="flex justify-between mt-4 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="text-red-500 font-medium"
                  >
                    Cancel
                  </button>
                  <button className="flex items-center gap-1 text-zinc-300 font-medium">
                    💬 Chat with us
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllOrders;
