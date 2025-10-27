import React from 'react';
import { FaTag, FaGift, FaPercentage } from 'react-icons/fa';

const offers = [
  {
    icon: <FaGift size={36} />,
    title: "Get 20% OFF on First Repair",
    description: "Use code WELCOME20 during your first booking.",
    code: "WELCOME20"
  },
  {
    icon: <FaTag size={36} />,
    title: "Flat ₹500 OFF on Laptops",
    description: "Valid for devices above ₹5000 repair cost.",
    code: "LAPTOP500"
  },
  {
    icon: <FaPercentage size={36} />,
    title: "Seasonal Offer",
    description: "15% off on all appliance repairs till July 31.",
    code: "JULY15"
  },
];

const UserOffers = () => {
  return (
    <div className="w-full px-6 md:px-20 py-16 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="text-white text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-lg">
        Available Offers
        </h1>
        <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto"></div>
        <h1 className="font-semibold text-gray-300 capitalize mt-2">
          We service all brands of Desktop and Laptop computers.
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {offers.map((offer, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg hover:scale-105 hover:bg-white/20 transition-all duration-300"
          >
            
            {/* Icon */}
            <div className="mb-4 text-yellow-400">
              {offer.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>

            {/* Description */}
            <p className="text-gray-300 mb-6">{offer.description}</p>

            {/* Code & Button */}
            <div className="flex items-center justify-between">
              <span className="bg-yellow-400/20 text-sm px-3 py-1 rounded font-mono text-yellow-300 border border-yellow-400/40">
                {offer.code}
              </span>
              <button className="bg-[#DC2626] text-white font-semibold text-sm px-4 py-2 rounded shadow-md transition-all">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOffers;
