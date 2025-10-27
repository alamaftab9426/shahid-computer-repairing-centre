import React, { useState } from 'react'
import { FaRegEye } from "react-icons/fa";
const Products = () => {

  const myCardSection = [
    {
      img: './images/lap.jpg', // Make sure the image path is correct
      title: 'HP LAPTOP',
      price: 12000,
      discount: 12,
      processortype: 'Core i5',
      disk: 'SSD.512 GB',
      ram: 16,
      genrations: "5th"
    },
    {
      img: './images/lap3.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },

    {
      img: './images/lap4.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },

    {
      img: './images/lap5.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },
    {
      img: './images/lap5.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },
    {
      img: './images/lap5.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },
    {
      img: './images/lap5.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },
    {
      img: './images/lap5.jpg', // Make sure the image path is correct
      title: 'DELL',
      desc: "Optimized for 24/7 recording.",
      price: 15000,
      discount: 16,
      processortype: 'Core i7',
      disk: 'SSD.512 GB',
      ram: 16
    },


  ];



  return (
    <div className='w-full min-h-screen py-6 bg-zinc-950 '>
      <div className="text-white text-center mb-12 px-7">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white drop-shadow-md uppercase leading-none">
          OUR PRODUCTS
        </h1>
        <div className="mt-2 w-20 md:w-50 h-1 bg-[rgb(0,216,255)] rounded-full mx-auto"></div>

        <p className='font-semibold text-gray-300 capitalize mt-3'>Here are the top reasons why our customers trust us with their valuable devices for computer and laptop repair services</p>
      </div>

      <div className='h-full w-[90%] mx-auto px-4'>
        {/* Card Secrion start  */}

        <div className="grid md:grid-cols-4 gap-8 mt-8 ">

          {myCardSection.map((item, index) => (
            <div className="rounded-xl shadow-xl border border-zinc-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-white overflow-hidden" key={index}>
              <div className="relative overflow-hidden group">
                <img
                  src={item.img}
                  className="rounded-t-md w-full h-[270px] object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Laptop"
                />

                {/* Overlay */}
                <div className="absolute top-full left-0 group-hover:top-0 transition-all duration-500 w-full h-full bg-gradient-to-t from-black/80 to-transparent rounded-t-md flex items-center justify-center">
                  <div className="text-white absolute bottom-0 left-0 ml-3 mb-2 font-semibold">
                    <p>PROCESSOR: {item.processortype}</p>
                    <p>HARD DISK: {item.disk}</p>
                    <p>RAM: {item.ram}</p>
                    <p>GENRATION: {item.genrations}</p>
                  </div>
                </div>
              </div>

              <div className="px-3 mt-4">
                <a href='/login'><button className="relative flex items-center justify-center gap-2 bg-red-600 hover:bg-blue-800 text-white py-2 px-4 rounded-md w-full font-semibold text-sm sm:text-base">
                  <FaRegEye className="text-lg" />
                  <span>View More</span>
                </button></a>


              </div>

              <div className=" px-3 mb-6 mt-3">
                <h1 className="font-semibold text-lg capitalize">{item.title}</h1>

                <div className="flex gap-2  items-center">
                  <label>{item.price}</label>
                  <del className="font-semibold text-gray-400">₹{item.price}</del>
                  <label className="text-gray-400">{item.discount}% OFF</label>
                  <a href="#" className="text-blue-500 font-semibold ml-4 relative group">
                    Learn More
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </div>
              </div>
            </div>
          ))}



        </div>
        {/* Card Secrion End */}


      </div>


    </div>
  )
}

export default Products