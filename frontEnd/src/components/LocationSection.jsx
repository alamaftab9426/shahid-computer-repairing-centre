"use client";
import React from "react";

const locations = [
  {
    name: "Shahid Computer Repairing Center",
    address: "Indira Chowk, Shahganj Road, Badlapur Jaunpur UP.",
    phone: "+91 8896865671",
    email: "info@shahidcomputers.com",
    mapLink:
      "https://www.google.com/maps/place/Shahid+Computer+Repairing+Centre/@25.8935746,82.4499609,17z/data=!3m1!4b1!4m6!3m5!1s0x39906c5fecf6712f:0x1ba8c1432b4f8eb3!8m2!3d25.8935746!4d82.4525358!16s%2Fg%2F11clsnh99p?entry=ttu",
    img: "./images/map.png",
  },
];

const LocationSection = () => {
  return (
    <div className="w-full py-2 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
       <div className="text-white text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-none uppercase">
            OUR LOCATION
          </h1>
          <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Location Cards */}
        <div className="flex flex-col gap-16">
          {locations.map((loc, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-10 bg-[#1c1c1c] p-8 rounded-2xl shadow-2xl hover:shadow-[#00D8FF]/40 transition-shadow duration-500"
            >
              {/* Left Side - Map */}
              <div className="md:w-1/2 w-full cursor-pointer">
                <a
                  href={loc.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={loc.img}
                    alt={loc.name}
                    className="w-full h-80 md:h-[500px] object-cover rounded-sm shadow-lg hover:scale-105 transition-transform duration-500"
                  />
                </a>
              </div>

              {/* Right Side - Info */}
              <div className="md:w-1/2 w-full text-left md:pl-8">
                <h3 className="text-3xl md:text-4xl font-bold text-[#54D4EC] mb-4 uppercase">
                  {loc.name}
                </h3>
                <div className="space-y-3 text-lg">
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">📍 Address:</span>{" "}
                    {loc.address}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">📞 Phone:</span>{" "}
                    {loc.phone}
                  </p>
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">📧 Email:</span>{" "}
                    {loc.email}
                  </p>
                </div>
                <a
                  href={loc.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-6 bg-[#51DAEA] hover:bg-red-600 text-white font-semibold py-3 px-5 rounded-lg shadow-lg transition duration-300"
                >
                  Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 py-6">
           <div className="text-white text-center mb-10">
          <h1 className="text-4xl md:text-4xl font-bold tracking-tighter leading-none capitalize">
           Why Visit US
          </h1>
          <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto animate-pulse"></div>
        </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 text-center">
              <h3 className="text-xl font-semibold text-[#00D8FF] mb-3">Fast Service</h3>
              <p className="text-gray-300">
                Quick turnaround for laptop, computer, and CCTV repairs.
              </p>
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 text-center">
              <h3 className="text-xl font-semibold text-[#00D8FF] mb-3">Trusted Team</h3>
              <p className="text-gray-300">
                Experienced professionals ensuring reliable and honest work.
              </p>
            </div>
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 text-center">
              <h3 className="text-xl font-semibold text-[#00D8FF] mb-3">On-Site Support</h3>
              <p className="text-gray-300">
                We also provide doorstep service for your convenience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
