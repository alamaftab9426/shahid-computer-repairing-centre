import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import LaptopMini from './LaptopMini';
import Layout from './Layout';
import 'remixicon/fonts/remixicon.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const BASE_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  const navigate = useNavigate();
  const [formValue, setFormValue] = useState({
    name: '',
    lastname: '',
    emailaddress: '',
    password: '',
    mobileno: '',
    gender: '',
    dob: '',
  });

  const [errors, setErrors] = useState({});
   const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const checkPasswordStrength = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password) return '';
    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSymbol)
      return 'Strong';
    if ((hasLower && hasNumber) || (hasUpper && hasSymbol)) return 'Medium';
    return 'Weak';
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 'Weak':
        return 'text-red-500 font-semibold';
      case 'Medium':
        return 'text-yellow-500 font-semibold';
      case 'Strong':
        return 'text-green-500 font-semibold';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formValue.name.trim()) newErrors.name = 'Name is required';
    if (!formValue.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formValue.mobileno.trim()) newErrors.mobileno = 'Contact number is required';
    else if (!/^\d{10}$/.test(formValue.mobileno))
      newErrors.mobileno = 'Mobile number must be 10 digits';
    if (!formValue.emailaddress.trim()) newErrors.emailaddress = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formValue.emailaddress))
      newErrors.emailaddress = 'Invalid email';
    if (!formValue.password.trim()) newErrors.password = 'Password is required';
    else if (formValue.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (!formValue.gender) newErrors.gender = 'Select your gender';
    if (!formValue.dob) newErrors.dob = 'Date of birth is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Signup Failed! Please check the form.', {
        theme: 'dark',
        autoClose: 3000,
        position: 'top-center',
      });
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, formValue);
      toast.success('Signup successful!', {
        theme: 'dark',
        autoClose: 3000,
        position: 'top-center',
        transition: Bounce,
      });
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed!', {
        theme: 'dark',
        autoClose: 3000,
        position: 'top-center',
      });
    }
  };

  return (
    <Layout>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-red-800 animate-gradient"></div>

        <div className="flex flex-col md:flex-row md:bg-white/10 rounded-sm overflow-hidden w-full max-w-6xl relative z-10">
          {/* Left Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name and Last Name */}
              <div className="flex gap-3">
                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    name="name"
                    placeholder="First Name"
                    value={formValue.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
                </div>

                <div className="flex flex-col w-1/2">
                  <input
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formValue.lastname}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {errors.lastname && <span className="text-red-500 text-sm mt-1">{errors.lastname}</span>}
                </div>
              </div>

              {/* Mobile Number */}
              <div className="flex flex-col">
                <input
                  type="number"
                  name="mobileno"
                  placeholder="Contact Number"
                  value={formValue.mobileno}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors.mobileno && <span className="text-red-500 text-sm mt-1">{errors.mobileno}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <input
                  type="email"
                  name="emailaddress"
                  placeholder="Email Address"
                  value={formValue.emailaddress}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors.emailaddress && <span className="text-red-500 text-sm mt-1">{errors.emailaddress}</span>}
              </div>

              {/* Password with Strength */}
              {/* Password with Strength + show/hide icon */}
<div className="flex flex-col relative">
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      name="password"
      placeholder="Enter Your Password"
      value={formValue.password}
      onChange={handleChange}
      className="w-full p-3 pr-12 rounded-xl bg-white/80 text-gray-800 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-red-400"
    />

    {/* Toggle button (absolute right inside input) */}
    <button
      type="button"
      onClick={() => setShowPassword(prev => !prev)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-700 hover:text-gray-900"
    >
      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
    </button>
  </div>

  {passwordStrength && (
    <span className={`text-sm mt-1 ${getStrengthColor()}`}>
      Password Strength: {passwordStrength}
    </span>
  )}
  {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password}</span>}
</div>

              {/* Gender */}
              <div className="flex flex-col">
                <select
                  name="gender"
                  value={formValue.gender}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <span className="text-red-500 text-sm mt-1">{errors.gender}</span>}
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col">
                <input
                  type="date"
                  name="dob"
                  max={new Date().toISOString().split('T')[0]}
                  value={formValue.dob}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {errors.dob && <span className="text-red-500 text-sm mt-1">{errors.dob}</span>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-300"
              >
                Sign Up
              </button>
            </form>


            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 text-sm text-gray-200">
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-red-400 hover:underline">
                  Login
                </a>
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex w-full md:w-1/2 flex-col items-center justify-center bg-white/5 px-6 gap-4 relative">
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

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Signup;
