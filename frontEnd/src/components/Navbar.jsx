"use client";
import React, { useState } from "react";
import { FaFacebook, FaLinkedin, FaInstagramSquare } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // 🔹 new state

  return (
    <>
      {/* Main Nav */}
      <nav className="backdrop-blur-lg bg-zinc-950 text-white flex items-center justify-between md:justify-around gap-5 fixed z-[50] w-full top-0 px-4 md:px-10 py-3 shadow-lg border-b border-gray-700">
        {/* Logo */}
        <div>
          <img src="/images/logo.png" className="w-[120px] h-[70px] object-cover" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          {["Home", "About", "Services", "Contact", "Products"].map((item, index) => (
            <a
              key={index}
              href="/"
              className="uppercase relative font-semibold tracking-wide after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-gradient-to-r after:from-[#44BCFF] after:to-[#FF44EC] after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Search (Desktop) */}
        <div className="hidden md:flex items-center relative group">
          <input
            type="text"
            placeholder="Search"
            className="border border-gray-500 rounded-full py-2 pl-10 pr-4 w-[200px] group-focus-within:w-[280px] transition-all duration-300 text-black bg-gray-200 focus:outline-none"
          />
          <IoSearch className="absolute ml-3 text-gray-600 text-xl left-2 top-2.5" />
        </div>

        {/* Social + Auth Buttons (Desktop) */}
        <div className="hidden md:flex gap-5 items-center">
          <div className="flex gap-4 text-2xl">
            {[<FaFacebook />, <FaLinkedin />, <FaInstagramSquare />].map(
              (Icon, idx) => (
                <span
                  key={idx}
                  className="hover:text-[#4CEACB] transition-transform duration-300 hover:scale-110 cursor-pointer"
                >
                  {Icon}
                </span>
              )
            )}
          </div>

          <div className="flex gap-3">
            {/* Signup */}
            <div className="relative inline-flex group">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-md group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <a
                href="/signup"
                className="relative inline-flex items-center justify-center px-5 py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl"
              >
                SIGNUP
              </a>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-400 mt-2"></div>

            {/* Login */}
            <div className="relative inline-flex group">
              <div className="absolute transition-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#FF44EC] via-[#44BCFF] to-[#FF675E] rounded-xl blur-md group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <a
                href="/login"
                className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gray-900 rounded-xl"
              >
                LOGIN
              </a>
            </div>
          </div>
        </div>

        {/* Mobile View Buttons */}
        <div className="flex md:hidden gap-3 items-center">
          {/* Search Toggle */}
          <button onClick={() => setShowSearch(!showSearch)}>
            <IoSearch className="text-2xl" />
          </button>

          {/* Animated Search Input (Mobile only) */}
          <AnimatePresence>
            {showSearch && (
              <motion.input
                key="mobile-search"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 160, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                type="text"
                placeholder="Search..."
                className="border border-gray-400 rounded-full px-3 py-1 text-black bg-gray-200 focus:outline-none"
              />
            )}
          </AnimatePresence>

          {/* Hamburger */}
          <button onClick={() => setShowMenu(true)}>
            <GiHamburgerMenu className="text-3xl" />
          </button>
        </div>
      </nav>

      {/* Sidebar + Backdrop Animation (Mobile) */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
            />

            {/* Sidebar */}
            <motion.aside
              key="sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-64 bg-gradient-to-b from-[#1a1a1a] via-[#212121] to-[#2b2b2b] text-white p-6 z-50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Menu</h2>
                <MdClose
                  className="text-2xl cursor-pointer"
                  onClick={() => setShowMenu(false)}
                />
              </div>

              <ul className="flex flex-col gap-4 text-lg">
                {["Home", "About", "Services", "Contact", "Products"].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <a
                      href="#"
                      className="hover:text-[#4CEACB] transition duration-300"
                      onClick={() => setShowMenu(false)}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <hr className="my-6 border-gray-600" />

              <div className="flex flex-col gap-4">
                <a
                  href="/login"
                  className="text-white border border-white px-4 py-2 rounded bg-[#350470] uppercase text-center font-semibold hover:bg-[#4CEACB] hover:text-black transition"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="text-white bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] px-4 py-2 rounded text-center font-semibold uppercase hover:opacity-90 transition"
                >
                  Signup
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
