import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
const messages = [
  "Confirming your appointment...",
  "Processing payment...",
  "Almost done...",
];

const BookingLoadingPage = () => {
  const [msgIndex, setMsgIndex] = useState(0);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { clinic, selectedDay, selectedTime, selectedPayment, coupon } =
    state || {};

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 1000);
    const timeout = setTimeout(() => {
      navigate("/booking-success", { replace: true });
    }, 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, clinic, selectedDay, selectedTime, selectedPayment, coupon]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://lottie.host/a4efe5f7-194d-429b-8d14-0f7a4e565fc5/HR3EAogwVr.lottie";
    script.type = "module";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 flex flex-col">
      {/* Header with Dark Mode Toggle */}
      <div className=" p-4 flex items-center justify-center relative">
        <h2 className="font-bold text-lg dark:text-white">
          Processing Booking
        </h2>
        <div className="absolute right-4">
         
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-neutral dark:text-white mb-2">
            {messages[msgIndex]}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we process your booking...
          </p>
        </div>

        <div className="relative">
          <dotlottie-wc
            src="https://lottie.host/a4efe5f7-194d-429b-8d14-0f7a4e565fc5/HR3EAogwVr.lottie"
            style={{ width: "300px", height: "300px" }}
            speed="1"
            autoplay
            loop
          ></dotlottie-wc>
        </div>
      </div>
    </div>
  );
};

export default BookingLoadingPage;
