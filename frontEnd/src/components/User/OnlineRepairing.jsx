import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Swal from "sweetalert2";
import "animate.css";

const OnlineRepairing = () => {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    address: "",
    problem: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile vs desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address";
    if (!formData.service) newErrors.service = "Please select a service";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.problem.trim()) newErrors.problem = "Describe the problem";
    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  setErrors(validationErrors);
  if (Object.keys(validationErrors).length > 0) return;

  setLoading(true);

  try {
    const token = localStorage.getItem("token"); // 
    const res = await fetch(`${BASE_URL}/api/service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 
      },
      body: JSON.stringify(formData),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: data.message || "Request submitted successfully!",
      });
      setFormData({
        name: "",
        email: "",
        service: "",
        address: "",
        problem: "",
      });
      setErrors({});
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: data.message || "Failed to submit service request",
      });
    }
  } catch (err) {
    console.error("Server Error:", err.message);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while submitting",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative w-full min-h-screen">
      <img
        src="./images/contact.jpg"
        alt="Repair Background"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      <div className="relative w-full min-h-screen bg-zinc-950 bg-opacity-70 backdrop-blur-sm flex flex-col items-center p-4">
        
    
         <h1 className="text-3xl md:text-5xl font-bold text-white uppercase">
      Services We Provides
        </h1>
        <div className="mt-2 w-20 md:w-24 h-1 bg-[#00D8FF] rounded-full mx-auto"></div>

        <div
          ref={ref}
          className={`w-full max-w-[1200px] flex flex-col ${isMobile ? "gap-6" : "md:flex-row gap-8"} items-start`}
        >
          {/* LEFT SIDE - Info */}
          <div
            className={`w-full text-center flex flex-col items-center justify-center space-y-3  mt-6 md:space-y-4 md:mt-[80px] 
              text-white ${inView ? "animate__animated animate__fadeInLeft" : "opacity-0"}`}
          >
            <h1 className=" text-2xl md:text-3xl font-bold">HOME SERVICES</h1>

            <h2 className="text-2xl md:text-3xl font-bold">
              Repairing | <span className="text-[#51D9E9]">CCTV</span> | Networking
            </h2>

            <h3 className="text-lg md:text-xl font-semibold text-white/90">
              Software & Windows | Installation
            </h3>

            <p className="text-sm md:text-base text-gray-400 leading-relaxed max-w-md mx-auto text-center">
              Trusted Solutions for All Your Technical Needs — fast, reliable, and at your doorstep.
            </p>

            <ul className="text-sm md:text-base text-gray-300 space-y-1 max-w-md mx-auto text-center">
              <li>✔ Free diagnosis on first visit</li>
              <li>✔ On-site and remote repair options</li>
              <li>✔ 24/7 emergency support</li>
              <li>✔ Affordable & transparent pricing</li>
            </ul>

            <div className="w-full flex justify-center mt-3">
              <button
                onClick={() =>
                  document.getElementById("repairForm").scrollIntoView({ behavior: "smooth" })
                }
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 
                 transition duration-300 text-white px-6 py-2 rounded-full shadow-lg text-sm md:text-base"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Form */}
          <div
            className={`${isMobile ? "w-full" : "md:w-3/4"}
              rounded-lg p-5 md:p-8 ${inView ? "animate__animated animate__fadeInRight" : "opacity-0"}`}
          >
            <form id="repairForm" onSubmit={handleSubmit} className="space-y-4">
              {["name", "email", "service", "address", "problem"].map((field) => {
                const labels = {
                  name: "Full Name",
                  email: "Email",
                  service: "Service Needed",
                  address: "Full Address",
                  problem: "Describe the Problem",
                };
                return (
                  <div key={field}>
                    <label className="block text-sm text-white mb-1">{labels[field]}</label>
                    {field === "service" ? (
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded bg-white/80 text-black outline-none 
                                   focus:ring-2 focus:ring-red-500 ${errors.service ? "border-2 border-red-500" : ""}`}
                      >
                        <option value="">Select a service</option>
                        <option>Repairing</option>
                        <option>CCTV Repairing</option>
                        <option>Networking</option>
                        <option>Laptop Repairing</option>
                        <option>Desktop Repairing</option>
                      </select>
                    ) : field === "address" || field === "problem" ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        rows="3"
                        placeholder={field === "address" ? "House no, Street, City, ZIP" : "Describe the issue"}
                        className={`w-full px-4 py-2 rounded bg-white/80 text-black outline-none 
                                   focus:ring-2 focus:ring-red-500 resize-none ${errors[field] ? "border-2 border-red-500" : ""}`}
                      ></textarea>
                    ) : (
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={field === "email" ? "example@gmail.com" : "Enter your " + labels[field].toLowerCase()}
                        className={`w-full px-4 py-2 rounded bg-white/80 text-black outline-none 
                                   focus:ring-2 focus:ring-red-500 ${errors[field] ? "border-2 border-red-500" : ""}`}
                      />
                    )}
                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                  </div>
                );
              })}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-[150px] bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition duration-300"
                >
                  {loading ? "Submitting..." : "Book Now"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OnlineRepairing;
