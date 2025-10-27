import React, { useEffect, useState } from "react";

const ThankYouPage = () => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUserName(parsed.name || storedUser);
      } catch {
        setUserName(storedUser);
      }
    }
  }, []);

  return (
    <div className="relative w-full h-[450px]">
      <img
        src="./images/thanks.jpg"
        alt="Thank You Background"
        className="w-full h-[450px] object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-2">
          Thank You Visit Again.
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          ({userName}..)
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-xl">
          Your request has been successfully submitted.
          Our team will contact you shortly to confirm your booking.
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;
