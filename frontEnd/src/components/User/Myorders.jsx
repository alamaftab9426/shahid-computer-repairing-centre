import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FiUser, FiMapPin, FiPhone, FiCheck } from "react-icons/fi";
import axios from "axios";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_URL;

const stepMap = {
  pending: 0,
  confirmed: 1,
  shipped: 2,
  completed: 3,
  delivered: 3,
};


const steps = ["Pending", "Confirmed", "Shipped", "Completed"];


// Animated ProgressBar Component
const ProgressBar = ({ currentStep }) => {
  const totalSteps = steps.length;

  // Corrected width calculation
  const progressWidth =
    currentStep === 0
      ? "0%"
      : `${((currentStep) / (totalSteps - 1)) * 100}%`;

  return (
    <div className="relative my-4">
      {/* Background line */}
      <div className="absolute top-3.5 left-0 w-full h-0.5   bg-gray-300 rounded"></div>

      {/* Animated red line */}
      <motion.div
        className="absolute top-3.5 left-0 h-0.5 bg-red-700 rounded"
        initial={{ width: 0 }}
        animate={{ width: progressWidth }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      ></motion.div>

      <div className="flex justify-between relative">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center relative w-6"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 relative z-10 ${isCompleted || isActive
                  ? "bg-red-700 border-red-700 text-white"
                  : "bg-white border-gray-400 text-gray-500"
                  }`}
              >
                {isCompleted ? <FiCheck className="text-white" /> : index + 1}
              </div>

              {/* Wave animation around active step */}
              {isActive && (
                <motion.div
                  className="absolute w-10 h-10 rounded-full bg-red-400 opacity-20"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                ></motion.div>
              )}

              <span
                className={`text-xs mt-1 text-center ${isCompleted || isActive
                  ? "text-red-700 font-semibold"
                  : "text-gray-400"
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


const MyOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("Home");
  const [addresses, setAddresses] = useState([
    { label: "Home", fullname: "Aftab Alam", city: "Delhi", phone: "+91 9876543210" },
    { label: "Office", fullname: "Aftab Alam", city: "Gurgaon", phone: "+91 9876543211" },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_URL}/api/order/myorders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = res.data.orders || [];
        const activeOrder = ordersData.find(
          (o) => o.status !== "delivered" && o.status !== "cancelled"
        );
        setSelectedOrder(activeOrder || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders(); // initial fetch
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

      Swal.fire("Cancelled!", res.data.message || "Your order has been cancelled.", "success");

      // Update local state after successful cancellation
      setSelectedOrder((prev) =>
        prev && prev._id === orderId
          ? { ...prev, status: "cancelled" }
          : prev
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong", "error");
    }
  };



  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p>No active orders yet.</p>
      </div>
    );
  }

  const items = [...(selectedOrder.laptops || []), ...(selectedOrder.cctvs || [])];
  const totalPrice = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalDiscount = items.reduce(
    (acc, i) => acc + ((i.price * (i.discount || 0)) / 100) * i.quantity,
    0
  );
  const processingFee = 99;
  const totalPayable = totalPrice - totalDiscount + processingFee;

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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6 flex flex-col md:flex-row justify-center gap-7  mt-5">
      {/* Left: Selected Order */}
      <div className="flex flex-col gap-10 w-full md:w-1/2">
        <div className="bg-zinc-900 rounded-sm px-6 border py-7">
          <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
            <p className="text-zinc-300 text-sm">
              Pay online for a smooth doorstep experience
            </p>
            <button className="text-blue-500 border border-blue-500 px-4 py-1 rounded hover:bg-blue-50">
              Pay ₹{totalPayable.toLocaleString()}
            </button>
          </div>

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
                      {selectedOrder.laptops
                        .filter((p) => p._id === item._id)
                        .map((p, i) => (
                          <div key={`laptop-${i}`} className="w-20 h-20 border border-gray-700 rounded-sm overflow-hidden">
                            <img
                              src={getImageUrl(p, "laptop")}
                              alt={p.title || "Laptop"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      {selectedOrder.cctvs
                        .filter((p) => p._id === item._id)
                        .map((p, i) => (
                          <div key={`cctv-${i}`} className="w-20 h-20 border border-gray-700 rounded-sm overflow-hidden">
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

                    {/* Laptop-specific info, leave empty for CCTV */}
                    <td className="p-2 border border-gray-700">{item.processorType || "-"}</td>
                    <td className="p-2 border border-gray-700">{item.ram || "-"}</td>
                    <td className="p-2 border border-gray-700">{item.disk || "-"}</td>
                    <td className="p-2 border border-gray-700">{item.generation || "-"}</td>
                    <td className="p-2 border border-gray-700">{item.description || "-"}</td>

                    {/* Quantity & Price */}
                    <td className="p-2 border border-gray-700">{item.quantity}</td>
                    <td className="p-2 border border-gray-700 font-semibold">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {/* Show ProgressBar only if order is not cancelled */}
          {selectedOrder.status === "cancelled" ? (
            <div className="text-red-500 font-semibold mt-4 text-center text-lg">
              This order has been cancelled
            </div>
          ) : (
            <ProgressBar currentStep={stepMap[selectedOrder.status] || 0} />
          )}

          <p className="text-sm text-zinc-300 mt-3">
            Delivery Executive details will be available once the order is out for delivery
          </p>

          <div className="flex flex-col sm:flex-row justify-between mt-4 pt-4 border-t border-gray-700 gap-2 sm:gap-0">
            <button
              onClick={() => handleCancel(selectedOrder._id)}
              className="text-red-500 font-medium"
              disabled={selectedOrder.status === "cancelled"}
            >
              Cancel
            </button>

            <button className="flex items-center gap-1 text-zinc-300 font-medium">
              💬 Chat with us
            </button>
          </div>
        </div>
      </div>

      {/* Right: Delivery + Price */}
      <div className="w-full md:w-1/4 flex flex-col gap-5 mt-6 md:mt-0">
        {/* Delivery Details */}
        <div className="bg-zinc-900 rounded-sm p-4 border">
          <h3 className="font-semibold text-zinc-200 mb-3">DELIVERY DETAILS</h3>
          <div className="space-y-2 mb-4 text-zinc-300 text-sm">
            <label className="block mb-2 font-medium">Select Address:</label>
            <div className="flex gap-2 flex-col sm:flex-row">
              <select
                value={selectedAddress}
                onChange={(e) => setSelectedAddress(e.target.value)}
                className="w-full bg-zinc-800 text-white p-2 rounded"
              >
                {addresses.map((addr) => (
                  <option key={addr.label} value={addr.label}>
                    {addr.label} - {addr.city}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  Swal.fire("Updated!", "Your delivery address has been updated.", "success")
                }
                className="bg-red-600 px-2 py-1 rounded-sm text-white font-medium"
              >
                Update
              </button>
            </div>
          </div>
          <div className="space-y-2 border-t border-gray-700 pt-3 text-zinc-300 text-sm">
            {addresses
              .filter((addr) => addr.label === selectedAddress)
              .map((addr) => (
                <div key={addr.label} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-300" />
                    <span className="font-medium">{addr.fullname}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-gray-300" />
                    <span>{addr.city}, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiPhone className="text-gray-300" />
                    <span>{addr.phone}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Price Details */}
        <div className="bg-zinc-900 rounded-sm p-4 border">
          <h3 className="font-semibold text-zinc-200 mb-3">PRICE DETAILS</h3>
          <div className="space-y-2 text-zinc-300 text-sm">
            <div className="flex justify-between">
              <span>Price ({items.length} items)</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-400">-₹{totalDiscount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Fee</span>
              <span>₹{processingFee}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t">
              <span>Total Amount</span>
              <span>₹{totalPayable.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300 mt-3">
              <span className="font-semibold">Paid By:</span>
              <span>Cash on Delivery</span>
            </div>
            <p className="text-green-400 mt-2">
              You saved ₹{totalDiscount.toLocaleString()} on this order
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
