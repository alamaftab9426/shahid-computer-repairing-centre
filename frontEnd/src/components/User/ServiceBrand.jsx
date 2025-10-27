"use client";
import React from "react";
import { motion } from "framer-motion";

const brands = [
  { img: "./images/brand1.png" },
  { img: "./images/brand2.png" },
  { img: "./images/brand3.png" },
  { img: "./images/brand4.png" },
  { img: "./images/brand5.png" },
  { img: "./images/brand6.png" },
];

const ServiceBrandMarquee = () => {
  return (
    <div className="bg-zinc-950 py-6 overflow-hidden w-full px-[46px] md:px-[115px]">
      {/* Heading */}
      <div className="text-white text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-wider uppercase">
          Service Brands
        </h1>
        <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto"></div>
        <h2 className="font-semibold text-gray-300 capitalize mt-2 text-sm md:text-base">
          We service all brands of Desktop and Laptop computers.
        </h2>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden w-full">
        <motion.div
          className="flex flex-nowrap space-x-8 md:space-x-12"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: 30, // scroll speed adjust yahan se
            ease: "linear",
          }}
        >
          {/* Duplicate brands array do baar render karna */}
          {[...brands, ...brands].map((brand, index) => (
            <div
              key={index}
              className="flex justify-center items-center min-w-[120px] sm:min-w-[160px] md:min-w-[180px]"
            >
              <img
                src={brand.img}
                className="h-16 sm:h-20 md:h-24 lg:h-28 object-contain"
                alt={`brand-${index}`}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceBrandMarquee;
