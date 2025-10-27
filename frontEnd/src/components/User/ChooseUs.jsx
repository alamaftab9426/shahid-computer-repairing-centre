import React from 'react'
import {FaUserCheck,} from "react-icons/fa";
import { GiMouse } from "react-icons/gi";
import { IoMdText } from "react-icons/io";
import { LuHandshake } from "react-icons/lu";
import { FaAward } from "react-icons/fa6";
import { GiAutoRepair } from "react-icons/gi";

const ChooseUs = () => {
    const cards = [
  {
  icon: <FaUserCheck size={100}/>,
    title: "Experienced Professionals",
    desc: "Our team of skilled technicians provides expert computer and laptop repair services with years of experience." ,
  },
  {
    icon: <GiMouse  size={100} />,
    title: "Expert Technical Skills",
    desc: "We offer reliable and professional help for all types of computer and laptop issues, from hardware to software." ,
  },
  {
    icon: <IoMdText   size={100} />,
    title: "Trustworthy & Proven",
    desc: "Our reputation is built on trust and customer satisfaction—check out our reviews from happy customers." ,
  },
  {
    icon: <LuHandshake    size={100} />,
    title: "Friendly & Accessible Service",
    desc: "Enjoy prompt, professional service. Most repairs are completed in just hours, with same-day service available!" ,
  },
  {
    icon: <FaAward    size={100} />,
    title: "Excellent Reputation in the Industry",
    desc: "Our commitment to attention to detail and loyal service has earned us a strong reputation with our clients." ,
  },
  {
    icon: <GiAutoRepair   size={100} />,
    title: "Affordable Diagnostics",
    desc: "Get a FREE diagnosis! We'll identify your device's issues, explain the options, and provide a price estimate." ,
  },
 
];
  return (
    <div className='w-full min-h-screen py-6 bg-zinc-950 '>
      <div className="text-white text-center mb-12 px-10">
        <h1 className="text-4xl md:text-5xl font-bold  text-white drop-shadow-md uppercase leading-none tracking-tighter">
          Why Choose US for Your Computer & Laptop Repairs?
        </h1>
        <div className="mt-2 w-20 md:w-50 h-1 bg-[rgb(0,216,255)] rounded-full mx-auto"></div>

        <p className='font-semibold text-gray-300 capitalize mt-3'>Here are the top reasons why our customers trust us with their valuable devices for computer and laptop repair services</p>
      </div>
      <div className=' w-[80%] min-h-screen mx-auto'>
        
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {cards.map((item, index) => (
          <div
  key={index}
  className="bg-zinc-600 hover:bg-[#2cb4c3] text-white p-6 shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-5 border py-20 group"
>
  {/* Icon Div */}
  <div className="flex justify-center mb-4 text-blue-600 group-hover:text-white transition duration-300">
    {item.icon}
  </div>

  {/* Heading Div */}
  <div className="text-center mb-2">
    <h2 className="text-xl font-semibold">{item.title}</h2>
  </div>

  {/* Paragraph Div */}
  <div className="text-center">
    <p className="text-sm">{item.desc}</p>
  </div>
</div>

        ))}
      </div>

      </div>
      </div>
  )
}

export default ChooseUs