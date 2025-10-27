import React from "react";
import { motion } from "framer-motion"; 
const Services = () => {
  const service = [
    {
      image: "./images/repair.jpg",
      heading: "Laptop & Desktop Repair",
      para: "Expert repair services for all laptop and desktop brands. From hardware faults to software troubleshooting, we provide quick and reliable solutions.",
    },
    {
      image: "./images/cam.jpg",
      heading: "CCTV Installation",
      para: "Enhance your security with advanced CCTV installation. High-definition cameras and professional setup for homes and businesses.",
    },
    {
      image: "./images/flight.jpg",
      heading: "Flight Tickets & Hajj Umrah",
      para: "Book domestic and international flight tickets at the best prices. Hassle-free booking process with instant confirmation.",
    },
    {
      image: "./images/tkt.jpg",
      heading: "Online Ticket Services",
      para: "We provide online booking services for flights, buses, and trains. Secure, fast, and reliable ticketing solutions at your fingertips.",
    },
    
    {
      image: "./images/swiper1.jpg",
      heading: "Motherbord Reparing",
      para: "Comprehensive IT support including software installation, virus removal, system upgrades, and complete computer servicing.",
    },
    {
      image: "./images/exchange.jpg",
      heading: "Money Exchanging",
      para: "Trusted money exchange services with the best rates. Safe and fast transactions for all major currencies.",
    },
  ];

  return (
    <div className="w-full py-10 bg-zinc-950 px-6">
      {/* Section Title */}
      <div className="text-white text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none">
          SERVICES
        </h1>
        <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto"></div>
      </div>

      {/* Responsive Grid */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {service.map((items, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-xl border border-cyan-500 shadow-md bg-white"
          >
            {/* Service Image */}
            <img
              src={items.image}
              alt={items.heading}
              className="w-full h-[250px] lg:h-[300px] object-cover"
            />

            {/* Dim Layer */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            {/* Text Content */}
            <div className="absolute top-6 left-6 right-6 z-10 text-white">
              <h2 className="text-xl md:text-2xl font-bold">
                {items.heading}
              </h2>
              <p className="mt-2 text-gray-300 text-sm md:text-base">
                {items.para}
              </p>

              {/* Button */}
              <a
                href="/login"
                className="mt-6 inline-block px-4 py-2 bg-cyan-500 text-white font-semibold rounded-md hover:bg-red-600 transition"
              >
                Get More Info
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Services;
