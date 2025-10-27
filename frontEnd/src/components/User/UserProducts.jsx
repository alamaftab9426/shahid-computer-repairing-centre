import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Laptops from "./Laptops";
import Cctv from "./Cctv";

export default function UserProducts() {
  const [selectedTab, setSelectedTab] = useState("OLD LAPTOP");

  const tabs = [
    { id: "OLD LAPTOP", label: "OLD LAPTOP" },
    { id: "CCTV", label: "CCTV" },
    { id: "EDIT", label: "PRODUCTS" },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-950">
      {/* TAB SECTION */}
      <div className="w-full bg-gray-950 text-white py-4 shadow-lg ">
        <div className="flex justify-center px-4">
         
          {/* Mobile Dropdown */}
          <div className="md:hidden w-full flex justify-center mt-4">
            <select
              value={selectedTab}
              onChange={(e) => setSelectedTab(e.target.value)}
              className="w-3/4 bg-zinc-800 text-white p-3 rounded-sm shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300"
            >
              {tabs.map((tab) => (
                <option
                  key={tab.id}
                  value={tab.id}
                  className="bg-zinc-800 text-white"
                >
                  {tab.label}
                </option>
              ))}
            </select>
          </div>


          {/* Desktop: Buttons */}
          <div className="hidden md:flex gap-4">
            {tabs.map((tab) => {
              const isActive = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md
                    ${isActive
                      ? "bg-gradient-to-r from-red-500 to-red-700 text-white shadow-lg scale-105"
                      : "bg-zinc-800 hover:bg-zinc-700 text-gray-200"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>


      <div className="p-4  md:px-10 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`md:p-4 rounded-md shadow-lg ${selectedTab === "EDIT" ? "text-white" : "bg-zinc-950"
              }`}
          >
            {selectedTab === "OLD LAPTOP" && <Laptops />}
            {selectedTab === "CCTV" && <Cctv />}
            {selectedTab === "EDIT" && (
              <div>
                <h2 className="text-xl font-bold mb-2 text-gray-800">
                  Edit Product Section
                </h2>
              
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
