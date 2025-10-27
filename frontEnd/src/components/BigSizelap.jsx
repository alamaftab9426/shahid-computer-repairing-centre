import React, { useState, useEffect } from "react";

const BigSizelap = () => {
  const [offsets, setOffsets] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const eyesCenters = [
        { x: window.innerWidth / 2 - 70, y: window.innerHeight / 2 },
        { x: window.innerWidth / 2 + 70, y: window.innerHeight / 2 },
      ];

      const newOffsets = eyesCenters.map((center) => {
        const dx = e.clientX - center.x;
        const dy = e.clientY - center.y;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 12); // max radius inside iris
        const angle = Math.atan2(dy, dx);
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        };
      });

      setOffsets(newOffsets);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* Background */}
      <div className="absolute inset-0 -z-10 blur-3xl opacity-60 rounded-2xl bg-gradient-to-br from-zinc-700 via-zinc-500 to-white/40 shadow-[0_0_60px_rgba(161,161,170,0.4),0_0_90px_rgba(244,244,245,0.3)] animate-pulse"></div>

      {/* Face container */}
      <div className="w-[clamp(260px,55vw,460px)] h-[clamp(180px,28vw,280px)] bg-black rounded-t-xl border-4 border-gray-800 relative overflow-hidden flex justify-evenly items-start p-5 pt-3">
        {/* Eyes */}
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-full w-[clamp(70px,12vw,95px)] h-[clamp(70px,12vw,95px)] flex items-center justify-center relative overflow-hidden mt-10"
          >
            {/* Black iris */}
            <div className="bg-black rounded-full w-[65%] h-[65%] flex items-center justify-center relative overflow-hidden">
              {/* White pupil */}
              <div
                className="bg-white rounded-full w-[40%] h-[40%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  transform: `translate(${offsets[i].x}px, ${offsets[i].y}px)`,
                  transition: "transform 0.05s",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Smile */}
      <div className="bg-white absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 rounded-b-full shadow-md w-[clamp(70px,10vw,110px)] h-[clamp(22px,3vw,28px)]"></div>

      {/* Base */}
      <div className="bg-gray-700 rounded-b-md mt-1 w-[clamp(160px,30vw,380px)] h-[clamp(8px,1.2vw,14px)]"></div>
    </div>
  );
};

export default BigSizelap;
