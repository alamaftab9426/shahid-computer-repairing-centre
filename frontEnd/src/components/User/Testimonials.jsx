import React, { useState } from 'react';
import { MdSms } from "react-icons/md";
const Testimonials = () => {
  const test = [
    {
      heading: 'Laptop Repair Services',
      para: 'Problems I had with my laptop were sorted in a very short time at a reasonable price. The technician provided excellent service. Highly recommended!',
      name: '— Saikat Debnath',
    },
    {
      heading: 'cctv installation',
      para: 'Problems I had with my laptop were sorted in a very short time at a reasonable price. The technician provided excellent service. Highly recommended!',
      name: '— aftab alam',
    },
    {
      heading: 'Laptop Repair Services',
      para: 'Problems I had with my laptop were sorted in a very short time at a reasonable price. The technician provided excellent service. Highly recommended!',
      name: '— pradeep kumar',
    },
  ];

  return (
    <div className="bg-black w-full h-auto relative pb-20">
      {/* Background Image */}
      <img
        src="./images/bg2.jpg"
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
        alt="Testimonials Background"
      />

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 py-14 px-6">
        {/* Heading */}
        <div className="text-white text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none text-white drop-shadow-md uppercase">
            Testimonials
          </h1>
          <div className="mt-2 w-20 md:w-24 h-1 bg-[rgb(0,216,255)] rounded-full mx-auto"></div>

          <p className='font-semibold text-gray-300 capitalize mt-3'>Discover why so many trust Shahid Computer for their computer, laptop, and Mac repair needs</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {test.map((val, index) => (
            <div
              key={index}
              className="bg-gray-300 text-black hover:bg-[#212121] hover:text-white hover:scale-105 transition-transform duration-300 ease-in-out p-6 rounded-md shadow-lg relative py-16"
            >
              {/* Quote Icon */}
              <MdSms className='text-[#2fbfcf] text-6xl absolute top-0 right-0' />

              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 uppercase">{val.heading}</h3>

              {/* Stars */}
              <div className="flex mb-3">
                
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927a1 1 0 0 1 1.902 0l1.147 3.527a1 1 0 0 0 .95.69h3.708a1 1 0 0 1 .592 1.81l-3 2.18a1 1 0 0 0-.364 1.118l1.147 3.527a1 1 0 0 1-1.538 1.118l-3-2.18a1 1 0 0 0-1.175 0l-3 2.18a1 1 0 0 1-1.538-1.118l1.147-3.527a1 1 0 0 0-.364-1.118l-3-2.18a1 1 0 0 1 .592-1.81h3.708a1 1 0 0 0 .95-.69l1.147-3.527Z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial */}
              <p className="text-sm leading-relaxed mb-4">{val.para}</p>

              {/* Name */}
              <p className="text-blue-600 font-semibold text-sm italic capitalize">{val.name}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
