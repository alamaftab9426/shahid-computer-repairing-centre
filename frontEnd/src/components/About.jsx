"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const About = () => {
  const team = [
    { name: "Mohammad Shahid", role: "Senior Technician", img: "./images/eng1.jpg" },
    { name: "Sara Malik", role: "Networking Expert", img: "./images/eng2.jpg" },
    { name: "Rohan Gupta", role: "CCTV Specialist", img: "./images/eng3.jpg" },
    { name: "Aftab Alam", role: "Customer Support", img: "./images/eng4.jpeg" },
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#212121] overflow-hidden z-[3]">
      {/* Background Image */}
      <img
        src="./images/about.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80"></div>

      {/* Content */}
      <div className="relative z-10 w-full h-full px-4 md:px-20 py-12 flex flex-col">
        {/* Heading */}
        <div className="text-white text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none uppercase">
            About Us
          </h1>
          <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Owner Section */}
        <div className="flex flex-col md:flex-row items-center gap-10 mb-16">
          <img
            src="./images/owner.jpg"
            alt="Owner"
            className="w-[300px] h-[300px] md:w-[420px] md:h-[420px] object-cover rounded-2xl shadow-2xl border-2 border-[#00D8FF]"
          />
          <div className="text-center md:text-left text-white max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00D8FF] uppercase">
              Mohammad Shahid
            </h2>
            <p className="text-lg font-semibold text-gray-300 mt-2">
              Founder & Lead Engineer
            </p>
            <p className="text-sm md:text-base text-gray-300 mt-4 leading-relaxed">
              With over 12 years of expertise in computer repairing, CCTV
              installation, and IT solutions, Shahid has built a reputation
              for excellence and trust. He believes in delivering services
              that are not just reliable but also affordable, ensuring every
              customer gets the best value.
            </p>
            <p className="text-sm md:text-base text-gray-300 mt-3 leading-relaxed">
              His mission is simple: to combine technical knowledge with
              honesty and dedication, creating long-term relationships with
              clients while solving their tech problems efficiently.
            </p>
          </div>
        </div>

        {/* Team Section with Swiper */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 uppercase text-center">
            Our Team Members
          </h2>

          <Swiper
           modules={[Autoplay, Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }} // ye dots dikhayega, arrow nahi
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 4 },
      }}
    >
            {team.map((member, index) => (
              <SwiperSlide key={index}>
                <div className="bg-[#2a2a2a] p-6 rounded-xl shadow-lg text-center">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-28 h-28 object-cover rounded-full mx-auto mb-4 border-2 border-[#00D8FF] shadow-md"
                  />
                  <h3 className="text-lg font-semibold text-white">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default About;
