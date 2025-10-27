import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import LaptopMini from "./LaptopMini"
import axios from "axios";

// Toastify
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Remix Icons
import "remixicon/fonts/remixicon.css";
import Layout from "./Layout";

const BASE_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const navigate = useNavigate();

  const [formValue, setFormValue] = useState({
    emailaddress: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Handle input change
  const inputFormHandling = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));

    // clear specific field error while typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Validate form
  const formValidation = () => {
    const newErrors = {};
    if (!formValue.emailaddress.trim()) newErrors.emailaddress = "Email is required";
    if (!formValue.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  //  Handle form submit
  const formHandling = async (e) => {
    e.preventDefault();
    const validationErrors = formValidation();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, formValue);

      toast.success(res?.data?.message || "Login Successful", {
        theme: "dark",
        transition: Bounce,
        position: "top-center",
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);
      localStorage.setItem("user", JSON.stringify(user));

      // navigate after toast
      setTimeout(() => {
        const userRole = user.role;
        if (userRole === "admin") {
          localStorage.setItem("adminToken", token);
          navigate("/admin/dashboard");
        } else {
          navigate("/user");
        }
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed. Try again", {
        theme: "dark",
        transition: Bounce,
        position: "top-center",
      });
    }
  };

  return (
    <Layout>
    <div className="relative md:min-h-screen flex justify-center md:items-center items-start pt-6 md:pt-10 overflow-hidden">
      {/* 🔹 Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-red-800 animate-gradient"></div>

      {/* 🔹 Bottom Wave SVG */}
      <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-[80px] md:h-[160px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.94,22,106.37,35.58,164,28,
            61.76-8,112.71-41.77,174-47,
            86.79-7.36,172.44,27.06,259,42,
            90.9,15.62,175.88,12.56,263-7,
            49.14-10.92,98.49-26.26,147-43V0Z"
            opacity=".25"
            className="fill-red-600"
          ></path>
          <path
            d="M0,0V15.81C47.94,35.9,106.37,51.55,164,44,
            61.76-8,112.71-41.77,174-47,
            86.79-7.36,172.44,27.06,259,42,
            90.9,15.62,175.88,12.56,263-7,
            49.14-10.92,98.49-26.26,147-43V0Z"
            opacity=".5"
            className="fill-red-500"
          ></path>
          <path
            d="M0,0V5.63C47.94,27,106.37,46.09,164,39,
            61.76-8,112.71-41.77,174-47,
            86.79-7.36,172.44,27.06,259,42,
            90.9,15.62,175.88,12.56,263-7,
            49.14-10.92,98.49-26.26,147-43V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      {/* 🔹 Main Container */}
      <div className="flex flex-col md:flex-row md:bg-white/10 md:backdrop-blur-lg rounded-md md:shadow-xl overflow-hidden w-full max-w-4xl relative z-10">

        {/* 🔸 Left Section (Form) */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="flex gap-4 items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Login</h2>
            <i className="ri-folder-user-line text-white text-4xl"></i>
          </div>

          <form onSubmit={formHandling} className="space-y-5">
            {/* Email */}
            <div>
              <input
                onChange={inputFormHandling}
                name="emailaddress"
                type="email"
                placeholder="Email Address"
                value={formValue.emailaddress}
                className={`w-full p-3 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  errors.emailaddress ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.emailaddress && (
                <p className="text-red-500 text-sm mt-1">{errors.emailaddress}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                onChange={inputFormHandling}
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Your Password"
                value={formValue.password}
                className={`w-full p-3 pr-10 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  errors.password ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
              <i
                className={`ri-eye${showPassword ? "" : "-off"}-line absolute right-4 top-3.5 text-xl text-gray-600 cursor-pointer`}
                onClick={togglePassword}
              ></i>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              Login
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 text-sm text-gray-200 gap-3 md:gap-0">
            <a href="/forgotpassword" className="hover:underline text-red-300">
              Forgot Password?
            </a>
            <p>
              Don’t have an account?{" "}
              <Link to="/signup" className="text-red-400 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* 🔸 Right Section (Image + Animation) */}
        <div className="hidden md:flex w-full md:w-1/2 flex-col items-center justify-center bg-white/5 px-6 py-8 gap-4 relative">
          <LaptopMini />
          <h1 className="text-5xl text-white mt-6 animate-bounce-slow">
            <i className="ri-rocket-2-line"></i>
          </h1>

          {/* Inline animations */}
          <style>
            {`
              @keyframes floatBlink {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-12px); }
              }
              .animate-bounce-slow {
                animation: floatBlink 2s ease-in-out infinite, blink 1.5s infinite;
              }
              @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
              }
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .animate-gradient {
                background-size: 300% 300%;
                animation: gradientShift 10s ease infinite;
              }
            `}
          </style>
          
        </div>
      </div>

      {/* Toastify Container */}
      <ToastContainer />
    </div>
    </Layout>
  );
};

export default Login;
