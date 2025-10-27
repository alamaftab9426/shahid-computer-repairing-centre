import React from 'react'
import Navbar from './NavBar'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-300">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Footer Start */}
      <footer className="bg-zinc-950 text-gray-300 pt-16">
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Website Links */}
          <div className="flex flex-col items-start">
            <h1 className="text-white font-bold text-lg md:text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">
              Website Links
            </h1>
            <ul className="space-y-2 text-sm md:text-base">
              <li className="hover:text-[#4CEACB] transition"><a href="#">Login</a></li>
              <li className="hover:text-[#4CEACB] transition"><a href="#">Signup</a></li>
            </ul>
            <img
              src="/images/logo.png"
              className="w-[120px] h-[120px] md:w-[150px] md:h-[160px] mt-4"
              alt="Brand Logo"
            />
          </div>

          {/* Follow Us */}
          <div>
            <h1 className="text-white font-bold text-lg md:text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">
              Follow Us
            </h1>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaFacebookF /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaInstagram /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaLinkedinIn /></a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#4CEACB] transition"><FaTwitter /></a>
            </div>
          </div>

          {/* Brand Details */}
          <div>
            <h1 className="text-white font-bold text-lg md:text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">
              Brand Details
            </h1>
            <p className="text-gray-400 leading-relaxed text-sm md:text-base">
              We provide trusted IT, security, and travel solutions. From computer repairs
              to CCTV setup, flight bookings, and currency exchange, our services are
              reliable, fast, and professional.
            </p>
          </div>

          {/* Contact Form */}
          <div>
            <h1 className="text-white font-bold text-lg md:text-xl mb-4 border-l-4 border-[#4CEACB] pl-2">
              Contact Us
            </h1>
            <form className="space-y-3">
              <input
                required
                name="fullname"
                className="bg-gray-800 w-full rounded p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#4CEACB]"
                placeholder="Your name"
              />
              <input
                required
                type="email"
                name="email"
                className="bg-gray-800 w-full rounded p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#4CEACB]"
                placeholder="Enter email id"
              />
              <textarea
                required
                name="message"
                className="bg-gray-800 w-full rounded p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#4CEACB]"
                placeholder="Message"
                rows={3}
              />
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B91C1C] text-white font-semibold rounded-sm hover:opacity-90 transition"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 py-6 text-center text-xs md:text-sm text-gray-500">
          © {new Date().getFullYear()} DEVELOPED BY AFTAB ALAM
        </div>
      </footer>
      {/* Footer End */}
    </div>
  )
}

export default Layout
