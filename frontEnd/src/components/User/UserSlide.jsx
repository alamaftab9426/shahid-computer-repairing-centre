import { Swiper, SwiperSlide } from "swiper/react";
import React, { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "animate.css";

const UserSlide = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slideData = [
    {
      image: "./images/swiper2.jpg",
      firstHeading: "CCTV INSTALATION &",
      secondHeading: "REPAIR SERVICES",
      tagline: "FAST REPAIR TURNAROUND",
      offerText: "GET OFFER TODAY HOME SERVICE",
      offerHighlight: "10% OFF",
      contact: "+91 8896865671",
      email: "info@shahidcomputer.com",
      site: "www.shahidcomputer.com",
    },
    {
      image: "./images/swiper1.jpg",
      firstHeading: "MOTHERBORD REPAIR &",
      secondHeading: "MAINTENANCE",
      tagline: "SAME DAY SERVICE",
      offerText: "GET FREE DIAGNOSIS",
      offerHighlight: "SAVE NOW",
      contact: "+91 8896865672",
      email: "support@shahidcomputer.com",
      site: "www.shahidcomputer.com",
    },
    {
      image: "./images/swiper.jpg",
      firstHeading: "LAPTOP & DESKTOP",
      secondHeading: "MAINTENANCE",
      tagline: "SAME DAY SERVICE",
      offerText: "GET FREE DIAGNOSIS",
      offerHighlight: "SAVE NOW",
      contact: "+91 8896865672",
      email: "support@shahidcomputer.com",
      site: "www.shahidcomputer.com",
    },
    {
      image: "./images/swiper3.jpg",
      firstHeading: "LAPTOP & DESKTOP",
      secondHeading: "MAINTENANCE",
      tagline: "SAME DAY SERVICE",
      offerText: "GET FREE DIAGNOSIS",
      offerHighlight: "SAVE NOW",
      contact: "+91 8896865672",
      email: "support@shahidcomputer.com",
      site: "www.shahidcomputer.com",
    },
  ];

  return (
    <div className="mt-[-10px]">
      <Swiper
        pagination={{ dynamicBullets: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="mySwiper"
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slideData.map((item, index) => (
          <SwiperSlide key={index} className="relative w-full">
            {/* Background Image */}
            <img
              src={item.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-[320px] sm:h-[420px] md:h-[550px] object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

            {/* Overlay Content */}
            <div
              className={`
    overlay-box absolute top-0 left-0 h-full w-full md:w-[60%] text-white flex flex-col justify-center px-3 sm:px-5 md:px-10 z-20
    ${activeIndex === index ? "animate__animated animate__fadeInUp" : ""}
  `}
            >
              <h2 className="text-base sm:text-lg mt-[60px] ml-5 md:text-4xl font-bold font-sans sm:mt-6 md:mt-20">
                {item.firstHeading}
              </h2>

              <h3 className="text-sm sm:text-lg md:text-3xl ml-5 font-bold mt-1 mb-1 sm:mb-2 md:mb-3 font-sans">
                {item.secondHeading}
              </h3>

              <p className="text-xs sm:text-sm ml-5 md:text-xl text-yellow-400 font-semibold mb-1 sm:mb-2">
                {item.tagline}
              </p>

              <p className="bg-gray-700 px-2 sm:px-3 ml-5 md:px-4 py-1 md:py-2 rounded-md w-max font-semibold text-[10px] sm:text-sm md:text-base">
                {item.offerText}{" "}
                <span className="text-white">{item.offerHighlight}</span>
              </p>

              <div className="mt-1 sm:mt-2 ml-5 md:mt-4 text-[10px] sm:text-sm md:text-base space-y-0.5 sm:space-y-1">
                <p className="flex items-center gap-1 sm:gap-2 text-yellow-300">
                  📞 Call Us: <span className="text-white">{item.contact}</span>
                </p>
                <p className="flex items-center gap-1 sm:gap-2 text-yellow-300">
                  📧 Email: <span className="text-white">{item.email}</span>
                </p>
                <p className="text-gray-300">🌐 {item.site}</p>
              </div>

              <button className="mt-2 sm:mt-3 ml-5 md:mt-5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:brightness-110 text-white font-semibold py-1 sm:py-1.5 md:py-2 px-3 sm:px-4 md:px-6 rounded shadow-lg transition duration-300 w-max text-[10px] sm:text-sm md:text-base">
                Book Now
              </button>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom CSS for ClipPath */}
      <style>{`
        .overlay-box {
          background-color: rgba(0, 0, 0, 0.75);
          clip-path: polygon(0 24%, 60% 24%, 100% 100%, 0% 100%);
        }
      `}</style>
    </div>
  );
};

export default UserSlide;
