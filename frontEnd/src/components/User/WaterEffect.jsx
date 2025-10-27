import React, { useEffect, useRef, useState } from "react";
import {
  FaTools,
  FaLaptop,
  FaCogs,
  FaNetworkWired,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

const WaterEffect = () => {
  const turbulenceRef = useRef(null);
  const statsRef = useRef(null);
  const [counts, setCounts] = useState([0, 0, 0, 0, 0]);
  const [visible, setVisible] = useState(false);

  const stats = [
    { icon: <FaTools />, number: 15, suffix: "+", label: "Years Experience" },
    { icon: <FaLaptop />, number: 1200, suffix: "+", label: "Laptops Repaired" },
    { icon: <FaCogs />, number: 800, suffix: "+", label: "CCTV Installed" },
    { icon: <FaUsers />, number: 2000, suffix: "+", label: "Happy Clients" },
    { icon: <FaCheckCircle />, number: 100, suffix: "%", label: "Service Satisfaction" },
  ];

  // Always running ripple animation
  useEffect(() => {
    let frame;
    let freq = 0.012;
    let direction = 1;

    const animate = () => {
      if (turbulenceRef.current) {
        freq += direction * 0.00005;
        if (freq > 0.018 || freq < 0.008) {
          direction *= -1;
        }
        turbulenceRef.current.setAttribute("baseFrequency", `${freq} ${freq}`);
      }
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Intersection Observer for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  // Count-up animation
  useEffect(() => {
    if (visible) {
      stats.forEach((stat, i) => {
        let start = 0;
        const end = stat.number;
        const duration = 2000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            start = end;
            clearInterval(timer);
          }
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[i] = Math.floor(start);
            return newCounts;
          });
        }, 16);
      });
    }
  }, [visible]);

  return (
   <div className="relative w-full min-h-screen overflow-hidden bg-black">
  {/* Background Water Effect */}
  <div className="absolute inset-0 z-0">
    <svg className="w-full h-full">
      <defs>
        <filter id="water-effect" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            ref={turbulenceRef}
            type="turbulence"
            baseFrequency="0.012 0.012"
            numOctaves="3"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <image
        href="/images/about.jpg"
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        filter="url(#water-effect)"
      />
    </svg>
  </div>

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black/50 z-10"></div>

  {/* Content Layer */}
  <div className="relative z-20">
    {/* Heading */}
    <div className="pt-[10%] text-center px-4">
      <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 drop-shadow-lg">
        SHAHID COMPUTER REPAIRING CENTER
      </h1>
      <p className="mt-4 text-white text-base md:text-lg max-w-3xl mx-auto">
        Providing <span className="text-yellow-300 font-semibold">expert repair services</span> for laptops, CCTV, networking, and all kinds of computer solutions.
        With <span className="text-yellow-300 font-semibold">15+ years of experience</span>, we guarantee fast, reliable, and affordable services.
      </p>
    </div>

    {/* Stats */}
    <div ref={statsRef} className="mt-20 px-16  md:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 text-center text-white">
        {stats.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white/10 py-10 px-6 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition transform hover:scale-105 shadow-lg"
          >
            <div className="mb-3 text-yellow-400 text-5xl md:text-6xl">{item.icon}</div>
            <span className="text-3xl md:text-4xl font-bold">
              {counts[index]}{item.suffix}
            </span>
            <span className="text-sm md:text-lg mt-1">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

  );
};

export default WaterEffect;
