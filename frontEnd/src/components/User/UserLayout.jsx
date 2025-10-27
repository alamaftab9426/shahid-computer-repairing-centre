import React from 'react'
import UserNav from './UserNav'
import { Outlet } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const UserLayout = () => {
  return (
    <div>
      <UserNav />


      <Outlet />

    
      <footer className="bg-zinc-950 text-gray-300 pt-16">
        <div className="w-10/12 mx-auto grid md:grid-cols-4 gap-12">

          {/* Website Links */}
          <div>
            <h1 className="text-white font-bold text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">Website Links</h1>
            <ul className="space-y-2">
              <li className="hover:text-[#4CEACB] transition"><a href="#">Login</a></li>
              <li className="hover:text-[#4CEACB] transition"><a href="#">Signup</a></li>
            </ul>
          </div>

       
          <div>
            <h1 className="text-white font-bold text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">Follow Us</h1>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaFacebookF /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaInstagram /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaLinkedinIn /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaTwitter /></a>
            </div>
          </div>

       
          <div>
            <h1 className="text-white font-bold text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">Brand Details</h1>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Ad saepe cupidium est velit excepturi sit corrupti tempora officia recusandae!
            </p>
            <img src="/images/logo.png" className="w-[120px]" alt="Brand Logo" />
          </div>

         
          <div>
            <h1 className="text-white font-bold text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">Contact Us</h1>
            <form className="space-y-3">
              <input required name="fullname" className="bg-gray-800 w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#4CEACB]" placeholder="Your name" />
              <input required type="email" name="email" className="bg-gray-800 w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#4CEACB]" placeholder="Enter email id" />
              <textarea required name="message" className="bg-gray-800 w-full rounded p-3 focus:outline-none focus:ring-2 focus:ring-[#4CEACB]" placeholder="Message" rows={3} />
              <div className='flex  items-center justify-center'>
                <button
                  type="submit"
                  className="px-3  bg-[#B91C1C] text-white font-semibold py-2 rounded-sm hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </div>

            </form>
          </div>
        </div>

       
        <div className="mt-16 border-t border-gray-800 py-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DEVELOPED BY AFTAB ALAM
        </div>
      </footer>
      
    </div>
  )
}

export default UserLayout
