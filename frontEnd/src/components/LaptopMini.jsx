import React, { useState, useEffect } from 'react';

const LaptopMini = () => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const deltaX = mouseX - window.innerWidth / 2;
      const deltaY = mouseY - window.innerHeight / 2;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 180);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative scale-75 md:scale-90 lg:scale-100">
      {/*  Glow Behind Laptop */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 opacity-30 blur-3xl z-[-1]"></div>

      {/* Laptop */}
      <div className="flex flex-col items-center py-5 px-5">
        <div className="w-[250px] h-[160px] bg-black rounded-t-xl border-4 border-gray-800 relative overflow-hidden">
          <div className="text-white p-4 flex justify-evenly">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-full h-[60px] w-[60px] relative">
                <div className="w-[40px] h-[40px] bg-black rounded-full absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]">
                  <div
                    style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }}
                    className="w-full h-3 absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
                  >
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-[60px] h-[20px] bg-white absolute bottom-6 left-1/2 -translate-x-1/2 rounded-b-full shadow-md"></div>
        </div>

        {/* Hinge */}
        <div className="w-[200px] h-[8px] bg-gray-700 rounded-b-md mt-2"></div>
      </div>
    </div>
  );
};

export default LaptopMini;
