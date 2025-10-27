import React from 'react';
import { RiMacLine } from "react-icons/ri";

const RepairGuides = () => {
  const categories = [
    { title: "Mac", icon: <RiMacLine size={60} /> },
    { title: "Windows PC", icon: <RiMacLine size={60} /> },
    { title: "Laptops", icon: <RiMacLine size={60} /> },
    { title: "Mobile", icon: <RiMacLine size={60} /> },
    { title: "CCTV", icon: <RiMacLine size={60} /> },
    { title: "Networking", icon: <RiMacLine size={60} /> },
    { title: "Printers", icon: <RiMacLine size={60} /> },
    { title: "Accessories", icon: <RiMacLine size={60} /> },
  ];

  return (
    <div className="w-full min-h-screen relative bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Repair Guides
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-lg">
          Easy-to-follow, step-by-step visual repair tutorials for all your devices.
        </p>
      </div>

      {/* Image Banner */}
      <div className="relative w-[90%] md:w-[80%] mx-auto h-[400px] rounded-2xl overflow-hidden shadow-2xl mb-16">
        <img src="/images/guide.jpg" className="w-full h-full object-cover" alt="Repair Guide" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        {/* Text Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-10">
          <h2 className="text-3xl md:text-5xl font-bold text-yellow-300 drop-shadow-lg">
            Step-by-Step Repair Instructions
          </h2>
          <p className="mt-4 text-lg max-w-xl leading-relaxed text-gray-200">
            Learn how to fix your laptops, PCs, CCTV, and other electronics with our professional guides.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-8 md:px-16 pb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-yellow-300">
          What do you need to fix?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-xl flex flex-col items-center justify-center hover:bg-white/20 hover:scale-105 transition-all shadow-lg"
            >
              <div className="mb-4 text-yellow-400">{item.icon}</div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-gray-500 text-sm">
          Thousands more step-by-step guides for everything
        </p>
      </div>
    </div>
  );
};

export default RepairGuides;
