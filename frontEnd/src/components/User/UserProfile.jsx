import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { IoMenu, IoClose } from "react-icons/io5";
import {
  FiUser,
  FiShoppingBag,
  FiMapPin,
  FiCreditCard,
  FiHeart,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import AllOrders from "./AllOrders";
import AllAddress from "./AllAddress";

const UserProfile = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [formValue, setFormValue] = useState({ name: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isDesktop = windowWidth >= 768;
  const sidebarVisible = isDesktop || sidebarOpen;

  // Input handling
  const inputFormHandling = (e) =>
    setFormValue({ ...formValue, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = res.data;
      setFormValue({ name: profile.name || "" });
      if (profile.profilePhoto) setPreview(`${BASE_URL}/${profile.profilePhoto}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchProfile();
    else setIsLoading(false);
  }, [token]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!token)
      return Swal.fire({ icon: "error", title: "Login Required" });

    try {
      const formData = new FormData();
      formData.append("name", formValue.name);
      if (image) formData.append("photo", image);

      const res = await axios.post(`${BASE_URL}/api/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedProfile = res.data;
      setFormValue({ name: updatedProfile.name });
      if (updatedProfile.profilePhoto)
        setPreview(`${BASE_URL}/${updatedProfile.profilePhoto}`);
      setImage(null);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Profile updated successfully!",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong!",
      });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  // Helper for avatar src
  const avatarSrc = preview || "/images/avt.avif";

  return (
    <div className="py-12 px-4 md:px-[110px] bg-zinc-950 min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center gap-4 md:hidden mb-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-3xl ml-7"
        >
          {sidebarOpen ? <IoClose /> : <IoMenu />}
        </button>
        <h1 className="text-3xl text-white font-bold ml-10">User Dashboard</h1>
      </div>

      <div className="flex gap-4 justify-center relative">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: sidebarVisible ? 0 : -300 }}
          transition={{ duration: 0.5 }}
          className="fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-zinc-900/90 border border-zinc-800 rounded-md px-3 flex flex-col gap-2 md:py-8 z-50 md:z-0"
        >
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white text-3xl self-end mt-6"
            >
              <IoClose />
            </button>
          )}

          {/* Profile Info */}
          <div className="flex items-center gap-2 p-2 rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={preview || "/images/avt.avif"}
                alt="" // alt empty rakho
                className="rounded-full w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // infinite loop avoid
                  e.target.src = "/images/avt.avif"; // fallback avatar
                }}
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-white font-semibold text-xl">
                {user?.name || "Name"}
              </h2>
              <p className="text-zinc-400 text-sm mt-1">+91-8853424605</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="w-full flex flex-col gap-3 mt-4">
            {[
              { tab: "profile", icon: <FiUser />, label: "Profile" },
              { tab: "orders", icon: <FiShoppingBag />, label: "My Orders" },
              { tab: "address", icon: <FiMapPin />, label: "Addresses" },
              { tab: "payment", icon: <FiCreditCard />, label: "Payment Methods" },
              { tab: "wishlist", icon: <FiHeart />, label: "Wishlist" },
              { tab: "notifications", icon: <FiBell />, label: "Notifications" },
            ].map((btn) => (
              <button
                key={btn.tab}
                className={`w-full px-4 py-2 rounded-sm text-left text-white font-medium flex items-center gap-3 transition ${activeTab === btn.tab ? "bg-rose-500" : "hover:bg-rose-500"
                  }`}
                onClick={() => {
                  setActiveTab(btn.tab);
                  if (!isDesktop) setSidebarOpen(false);
                }}
              >
                {btn.icon} {btn.label}
              </button>
            ))}

            <button
              onClick={() =>
                Swal.fire("Logged Out!", "You have been logged out.", "success")
              }
              className="w-full px-4 py-2 rounded-sm text-left text-white font-medium flex items-center gap-3 hover:bg-rose-500 transition"
            >
              <FiLogOut className="text-xl" /> Logout
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-sm p-8 backdrop-blur-md">
                  <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

                  {/* Image Upload Preview */}
                  <div className="flex justify-center mb-4">
                    <div className="relative w-32 h-32 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center cursor-pointer overflow-hidden bg-zinc-800">
                      <img
                        src={preview || "/images/avt.avif"}
                        alt=""
                        className=" w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/avt.avif";
                        }}
                      />

                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <form onSubmit={handleSubmitForm} className="grid gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-300">
                        Full Name
                      </label>
                      <input
                        name="name"
                        value={formValue.name}
                        required
                        onChange={inputFormHandling}
                        className="p-3 rounded-xl border border-zinc-700 bg-zinc-800 text-white focus:ring-2 focus:ring-rose-500"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-300">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.emailaddress || ""}
                        disabled
                        className="p-3 rounded-xl border border-zinc-700 bg-zinc-800 text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-rose-500 text-white rounded-xl mt-4 hover:scale-105 transition"
                    >
                      Save / Update
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <AllOrders />
              </motion.div>
            )}

            {activeTab === "address" && (
              <motion.div
                key="address"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
              >
                <AllAddress />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
