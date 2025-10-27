import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Toastify
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Remix Icons
import "remixicon/fonts/remixicon.css";
import Layout from "./Layout";
import LaptopMini from "./LaptopMini";

const BASE_URL = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(""); // Weak / Average / Strong
  const [passwordMatch, setPasswordMatch] = useState("");

  const toggleNew = () => setShowNew((prev) => !prev);
  const toggleConfirm = () => setShowConfirm((prev) => !prev);

  // Password strength check
  const checkStrength = (pwd) => {
    let strength = "Weak";
    if (pwd.length >= 6 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) strength = "Medium";
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd) && /[\W]/.test(pwd)) strength = "Strong";
    setPasswordStrength(strength);
  };

  // Confirm password match check
  const checkMatch = (confPwd) => {
    if (confPwd === newPassword && confPwd !== "") setPasswordMatch("Passwords match");
    else setPasswordMatch("Passwords do not match");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordStrength === "Weak") return toast.error("Password too weak", { theme: "dark", transition: Bounce, position: "top-center" });
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match", { theme: "dark", transition: Bounce, position: "top-center" });

    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/auth/reset-password/${token}`, { newPassword });
      toast.success(res.data.message || "Password updated successfully", { theme: "dark", transition: Bounce, position: "top-center" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password", { theme: "dark", transition: Bounce, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="relative md:min-h-screen flex justify-center md:items-center items-start pt-6 md:pt-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-red-800 animate-gradient"></div>

        <div className="absolute bottom-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-[80px] md:h-[160px]" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 120">
            <path d="M0,0V46.29c47.94,22,106.37,35.58,164,28,61.76-8,112.71-41.77,174-47,86.79-7.36,172.44,27.06,259,42,90.9,15.62,175.88,12.56,263-7,49.14-10.92,98.49-26.26,147-43V0Z" opacity=".25" className="fill-red-600"></path>
            <path d="M0,0V15.81C47.94,35.9,106.37,51.55,164,44,61.76-8,112.71-41.77,174-47,86.79-7.36,172.44,27.06,259,42,90.9,15.62,175.88,12.56,263-7,49.14-10.92,98.49-26.26,147-43V0Z" opacity=".5" className="fill-red-500"></path>
            <path d="M0,0V5.63C47.94,27,106.37,46.09,164,39,61.76-8,112.71-41.77,174-47,86.79-7.36,172.44,27.06,259,42,90.9,15.62,175.88,12.56,263-7,49.14-10.92,98.49-26.26,147-43V0Z" className="fill-white"></path>
          </svg>
        </div>

        <div className="flex flex-col md:flex-row md:bg-white/10 md:backdrop-blur-lg rounded-md md:shadow-xl overflow-hidden w-full max-w-4xl relative z-10">
          <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
            <div className="flex gap-4 items-center mb-8">
              <h2 className="text-3xl font-bold text-white">Reset Password</h2>
              <i className="ri-lock-password-line text-white text-4xl"></i>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); checkStrength(e.target.value); checkMatch(confirmPassword); }}
                  className="w-full p-3 pr-10 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                <i className={`ri-eye${showNew ? "" : "-off"}-line absolute right-4 top-3.5 text-xl text-gray-600 cursor-pointer`} onClick={toggleNew}></i>
                {newPassword && (
                  <span className={`text-sm mt-1 block ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Average" ? "text-yellow-400" : "text-green-500"}`}>
                    {`Password strength: ${passwordStrength}`}
                  </span>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); checkMatch(e.target.value); }}
                  className="w-full p-3 pr-10 rounded-xl bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
                {confirmPassword && (
                  <span className={`text-sm mt-1 block ${passwordMatch === "Passwords match" ? "text-green-500" : "text-red-500"}`}>
                    {passwordMatch}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || passwordStrength === "Weak" || newPassword !== confirmPassword}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8 text-sm text-gray-200 gap-3 md:gap-0">
              <a href="/login" className="hover:underline text-red-300">Back to Login</a>
            </div>
          </div>

          <div className="hidden md:flex w-full md:w-1/2 flex-col items-center justify-center bg-white/5 px-6 py-8 gap-4 relative">
            <LaptopMini />
            <h1 className="text-5xl text-white mt-6 animate-bounce-slow">
              <i className="ri-rocket-2-line"></i>
            </h1>
          </div>
        </div>

        <ToastContainer />
      </div>
    </Layout>
  );
};

export default ResetPassword;
