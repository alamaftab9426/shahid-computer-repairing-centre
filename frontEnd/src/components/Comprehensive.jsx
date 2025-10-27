import React, { useState } from 'react';
import { FaComputer } from "react-icons/fa6";
import { SiOpensourcehardware } from "react-icons/si";
const Comprehensive = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Manually position each ball (unique positions)
  const balls = [
    { id: 'ball1', factorX: 1, factorY: 1, top: 100, left: 100 },
    { id: 'ball2', factorX: -1, factorY: 1.5, top: 500, left: 400 },
    { id: 'ball4', factorX: 2, factorY: -1, top: 300, left: 700 },
    { id: 'ball5', factorX: -2, factorY: -1.2, top: 270, left: 1200},
    { id: 'ball6', factorX: 1.3, factorY: 4, top: 1-0, left: 650 },
    { id: 'ball7', factorX: 5.8, factorY: 10, top: 420, left: 1000 },
    { id: 'ball14', factorX: 5.8, factorY: 10, top: 355, left: 750 },
    { id: 'ball15', factorX: 5.8, factorY: 10, top: 300, left: 1260 },
    { id: 'ball16', factorX: 5.10, factorY: 10, top: 120, left: 950 },
    { id: 'ball8', factorX: 6.8, factorY: 2, top: 180, left: 200 },
    { id: 'ball9', factorX: 11, factorY: 2, top: 50, left: 850 },
    { id: 'ball10', factorX: 5.6, factorY: 2, top: 400, left: 100 },
    { id: 'ball11', factorX: 1.3, factorY: 2, top: 570, left: 1500 },
    { id: 'ball12', factorX: 4.5, factorY: 2, top: 600, left: 600 },
    { id: 'ball13', factorX: 9.5, factorY: 2, top: 500, left: 600 },
  ];
  const iconClass = 'text-6xl text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group-hover:text-blue-500'

  const hoverSection = [
    {
      icon:<FaComputer className={iconClass}/>,
      heading:"Free Device Diagnostics",
      para:' We provide a comprehensive diagnostic of your device’s issues with no hidden charges. We offer expert advice and solutions for your hardware and software needs'
    },
    {
      icon:<SiOpensourcehardware  className={iconClass}/>,
      heading:"Hardware & Software Installation",
      para:' Need help with hardware upgrades or installing new software? We provide tailored installation services to enhance your device’s performance.'
    },
    {
      icon:<FaComputer className={iconClass}/>,
      heading:"Expert Computer & Laptop Repairs",
      para:'Our skilled technicians handle a wide range of computer and laptop issues, from system crashes to hardware malfunctions. We guarantee fast and reliable repairs.'
    },
    {
      icon:<FaComputer className={iconClass}/>,
      heading:"Virus & Malware Removal",
      para:' We offer secure, remote virus and malware removal, ensuring your system is free from threats and running smoothly again.'
    },
    {
      icon:<FaComputer className={iconClass}/>,
      heading:"CCTV Installation",
      para:' We provide a comprehensive diagnostic of your device’s issues with no hidden charges. We offer expert advice and solutions for your hardware and software needs'
    },
    {
      icon:<FaComputer className={iconClass}/>,
      heading:"Free Device Diagnostics",
      para:' We provide a comprehensive diagnostic of your device’s issues with no hidden charges. We offer expert advice and solutions for your hardware and software needs'
    },
   
  ]
  

  return (

    <div
      className="bg-zinc-900 w-full min-h-screen relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {balls.map((ball) => {
        const moveX = (mousePos.x / 50) * ball.factorX;
        const moveY = (mousePos.y / 50) * ball.factorY;

        return (
          <div
            key={ball.id}
            className="w-5 h-5 rounded-full absolute transition-transform duration-200 bg-gradient-to-br from-white via-zinc-700 to-blue-500 shadow-lg"
            style={{
              top: `${ball.top}px`,
              left: `${ball.left}px`,
              transform: `translate(${moveX}px, ${moveY}px)`,
            }}
          ></div>
        );
      })}
<img
    src='./images/mother.jpg'
    alt='Background'
    className='absolute inset-0 w-full h-full object-cover opacity-30'
  />

        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60'></div>

      <div className='relative z-10 w-full h-full px-4 md:px-20 py-10 flex flex-col'>

         <div className='text-white text-center mb-4 leading-none tracking-tighter '>
      <h1 className='text-4xl md:text-6xl font-bold  uppercase'>Comprehensive Computer</h1>
      <h1 className='text-4xl md:text-6xl font-bold  uppercase'> Laptop & Cctv intsallation</h1>
      <div className='mt-2 w-20 md:w-52 h-1 bg-[#00D8FF] rounded-full mx-auto animate-pulse'></div>
      <p className='font-semibold text-gray-300 capitalize mt-3'>Here are the top reasons why our customers trust us with their valuable devices for computer and laptop repair services</p>
        </div>

      <div className="flex flex-wrap justify-center gap-5 px-2 py-10 ">
  {hoverSection.map((items, index) => (
    <div key={index} className='flex flex-col items-center justify-center gap-4 px-4 py-6 max-w-sm bg-transparent'>
      {/* Icon Circle */}
      <div className='group w-[150px] h-[150px] bg-blue-500 rounded-full relative transition-all duration-500 hover:bg-white hover:shadow-xl hover:border-2 hover:border-blue-400 hover:backdrop-blur-md hover:scale-105 hover:ring hover:ring-blue-300'>
        {items.icon}
      </div>

      {/* Heading */}
      <h1 className='text-2xl font-semibold text-white transition duration-300 group-hover:text-blue-400 text-center '>
        {items.heading}
      </h1>

      {/* Paragraph */}
      <p className='text-gray-300 text-center transition duration-300 group-hover:text-gray-700'>
        {items.para}
      </p>
    </div>
  ))}
</div>

      </div>
     
    </div>
  );
};

export default Comprehensive;
