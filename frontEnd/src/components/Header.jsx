"use client";
import { motion } from "framer-motion";
import BigSizelap from "./BigSizelap";

const Header = () => {
  return (
    <div className="relative w-full py-5 sm:h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="./images/mother.jpg"
          alt="Laptop Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/80 to-black/80" />
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center w-full px-3 sm:px-6 py-3 sm:py-10 ">
        {/* 🔹 Laptop Top */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mb-2 sm:mb-6"
        >
          <BigSizelap />
        </motion.div>

        {/* 🔹 Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl text-center"
        >
          <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-[#51DAEA] mb-2 sm:mb-4 uppercase">
            Shahid Computer Repairing Center
          </h1>

          <p className="text-sm sm:text-base  md:text-lg text-gray-200 leading-relaxed mb-3 sm:mb-6 capitalize">
            Professional computer and laptop repairing, reliable CCTV
            installation, doorstep service, and quality laptop delivery — all
            with trusted expertise and affordable solutions for your home and
            business needs.
          </p>

          {/* Button */}
          <a href="/login">
            <button className="px-3 py-2 sm:px-6 sm:py-3 bg-[#06B6D4] hover:bg-[#DC2626] rounded-md font-semibold shadow-lg transition">
              Explore Services
            </button>
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Header;
