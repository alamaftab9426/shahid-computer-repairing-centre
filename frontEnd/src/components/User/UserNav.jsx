import React, { useState, useEffect, useContext } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { IoSearch, IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaInfoCircle, FaCogs, FaPhoneAlt, FaBoxOpen } from "react-icons/fa";
import { CartContext } from "../context/cartContext";
import axios from "axios";

const UserNav = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { cart } = useContext(CartContext);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Fetch user profile
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [token, navigate, BASE_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return null;

  // Fix: Image Fallback Logic (same as UserProfile)
  const profileImage =
    user.profilePhoto && user.profilePhoto.trim() !== ""
      ? `${BASE_URL}/${user.profilePhoto}`
      : "/images/avt.avif";

  const navItems = ["Home", "About", "Services", "Contact", "Products"];

  return (
    <>
      {/* NAVBAR */}
      <nav className="backdrop-blur-lg bg-zinc-950 text-white flex items-center justify-between md:justify-around gap-5 fixed z-[50] w-full top-0 px-4 md:px-10 py-3 shadow-lg border-b border-gray-700">
        {/* Logo */}
        <div>
          <img src="/images/logo.png" className="w-[120px] h-[70px] object-cover" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={`/user`}
              className="uppercase relative font-semibold tracking-wide after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#44BCFF] after:to-[#FF44EC] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-5">
          {/* Search */}
          <div className="relative flex items-center">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-500 rounded-full py-2 pl-10 pr-4 w-[200px] text-black bg-gray-200 focus:outline-none"
            />
          </div>

          {/* Cart Icon */}
          <div className="relative flex items-center justify-center">
            <Link to="/user/cart" className="relative inline-block text-2xl">
              <FaShoppingCart className="hover:text-[#4CEACB] transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center z-50">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative group cursor-pointer flex gap-2 items-center">
            <img
              src={profileImage}
              alt=""
              className="rounded-full w-12 h-12 object-cover border-2 border-white"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/avt.avif";
              }}
            />
            <div className="absolute right-0 top-12 w-40 bg-zinc-900 border border-gray-700 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition duration-300 origin-top-right z-50 pointer-events-none group-hover:pointer-events-auto">
              <Link
                to="/user/profile"
                className="block px-4 py-2 text-white hover:bg-[#4CEACB]/20 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-[#4CEACB]/20 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE SECTION */}
        <div className="md:hidden flex gap-3">
          {/* Search Icon / Bar */}
          <div className="relative flex items-center">
            {!searchOpen ? (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center"
              >
                <IoSearch className="text-2xl hover:text-[#4CEACB] transition" />
              </button>
            ) : (
              <div className="absolute top-[7px] right-0 transform translate-y-0 flex items-center gap-2 bg-zinc-800 rounded-full px-3 py-2 border border-gray-600 animate-[slideIn_0.3s_ease_forwards]">
                <IoSearch className="text-gray-300 text-lg" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-none outline-none text-white text-sm w-[120px] placeholder-gray-400"
                  autoFocus
                />
                <IoClose
                  className="text-gray-400 hover:text-white cursor-pointer"
                  onClick={() => setSearchOpen(false)}
                />
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="relative flex items-center justify-center">
            <Link to="/user/cart" className="relative inline-block text-2xl">
              <FaShoppingCart className="hover:text-[#4CEACB] transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center z-50">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Profile */}
          <div className="relative group cursor-pointer flex gap-2 items-center">
            <img
              src={profileImage}
              alt=""
              className="rounded-full w-12 h-12 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/avt.avif";
              }}
            />
            <div className="absolute right-0 top-12 w-40 bg-zinc-900 border border-gray-700 rounded-sm shadow-lg opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transform transition duration-300 origin-top-right z-50 pointer-events-none group-hover:pointer-events-auto">
              <Link
                to="/user/profile"
                className="block px-4 py-2 text-white hover:bg-[#4CEACB]/20 transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-[#4CEACB]/20 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 md:hidden bg-gradient-to-b from-zinc-900/95 to-zinc-950/90 backdrop-blur-lg border-l border-[#4CEACB]/30 shadow-[0_0_15px_rgba(76,234,203,0.2)] transform ${menuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 z-40 flex flex-col p-6 gap-6`}
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-4 border-b border-gray-700 pb-4">
          <img
            src={profileImage}
            alt=""
            className="rounded-full w-12 h-12 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/avt.avif";
            }}
          />
          <div>
            <Link
              to="/user/profile"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-300 hover:text-[#4CEACB] transition"
            >
              View Profile
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-6">
          {[
            { name: "Home", icon: <FaHome /> },
            { name: "About", icon: <FaInfoCircle /> },
            { name: "Services", icon: <FaCogs /> },
            { name: "Contact", icon: <FaPhoneAlt /> },
            { name: "Products", icon: <FaBoxOpen /> },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={`/user`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 uppercase font-semibold tracking-wide text-gray-200 relative group hover:text-red-600 transition"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="relative inline-block">
                {item.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-[#44BCFF] to-[#FF44EC] group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-1 py-2 font-semibold text-white bg-red-600 rounded-sm hover:bg-red-800"
        >
          Logout
        </button>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(40px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}
      </style>
    </>
  );
};

export default UserNav;
