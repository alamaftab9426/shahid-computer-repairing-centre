import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaNewspaper } from 'react-icons/fa';

const newsList = [
  {
    id: 1,
    title: "Laptop Repair Offer!",
    content: "Get 20% OFF on your first laptop repair. Valid till July 31st. Visit our service center today!",
  },
  {
    id: 2,
    title: "New Service Center Launched",
    content: "We’ve opened a new center in Lucknow! Enjoy faster support and better experience. Flat ₹500 OFF for the first 100 users.",
  },
  {
    id: 3,
    title: "Motherboard Replacement Guide",
    content: `📍 We’ve proudly launched a brand-new repair center in Lucknow!

This center features:

- Fast diagnostics
- Comfortable waiting lounges
- Instant service tracking

💡 Tip: First 100 customers get flat ₹500 OFF!`,
  },
  ...Array(9).fill(null).map((_, i) => ({
    id: 4 + i,
    title: "Screen Repair Discount",
    content: "Flat ₹800 OFF on cracked smartphone screens. Use code SCREEN800.",
  })),
];

const NewsSection = () => {
  const [selectedNews, setSelectedNews] = useState(newsList[0]);
  const [y, setY] = useState(0);
  const intervalRef = useRef(null);

  const startScroll = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setY((prev) => (prev <= -newsList.length * 60 ? 0 : prev - 1));
      }, 30);
    }
  };

  const stopScroll = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  useEffect(() => {
    startScroll();
    return () => stopScroll();
  }, []);

  return (
    <div className="w-full min-h-screen px-10 py-16 flex gap-6 bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      
      {/* Left Panel */}
      <div
        className="w-1/3 p-4 rounded-xl shadow-lg h-[500px] flex flex-col border border-white/20 bg-white/10 backdrop-blur-md"
        onMouseEnter={stopScroll}
        onMouseLeave={startScroll}
      >
        <h2 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
          <FaNewspaper /> Latest Headlines
        </h2>

        <div className="relative flex-1 overflow-hidden">
          <motion.div
            className="absolute w-full"
            animate={{ y }}
            transition={{ ease: "linear", duration: 0 }}
          >
            {[...newsList, ...newsList].map((news, index) => (
              <div
                key={index}
                onClick={() => setSelectedNews(news)}
                className="cursor-pointer mb-3 p-3 bg-white/10 hover:bg-yellow-400/20 transition rounded-lg border border-white/10 shadow-sm"
              >
                📰 <span className="font-medium">{news.title}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="text-white w-2/3 p-6 rounded-xl shadow-lg h-[500px] flex flex-col justify-between bg-white/10 backdrop-blur-md border border-white/20">
        
        {/* Main News Content */}
        <div>
          <h1 className="text-2xl font-bold mb-4 text-yellow-400">{selectedNews.title}</h1>
          <p className="leading-relaxed text-lg whitespace-pre-line">{selectedNews.content}</p>
        </div>

        {/* Extra Content */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <h3 className="text-lg font-semibold text-yellow-300 mb-2">Related Updates</h3>
          <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
            <li>Free diagnostic service for all devices this week.</li>
            <li>Pickup & drop service now available in select cities.</li>
            <li>Join our loyalty program for exclusive rewards.</li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default NewsSection;
