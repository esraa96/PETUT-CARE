import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


const BookingSuccessPage = () => {
  const navigate = useNavigate();
  const [showText, setShowText] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    // تحميل سكريبت dotlottie-wc لعرض الأنيميشن أونلاين
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js";
    script.type = "module";
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.animate(
        [
          { transform: "scale(0.5)", opacity: 0 },
          { transform: "scale(1.1)", opacity: 1 },
          { transform: "scale(1)", opacity: 1 },
        ],
        {
          duration: 800,
          fill: "forwards",
          easing: "cubic-bezier(.68,-0.55,.27,1.55)",
        }
      );
    }

    const textTimeout = setTimeout(() => setShowText(true), 500);
    const navTimeout = setTimeout(() => navigate("/", { replace: true }), 3000);
    return () => {
      clearTimeout(textTimeout);
      clearTimeout(navTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-secondary-light dark:bg-gray-900 flex flex-col">
      {/* Header with Dark Mode Toggle */}
      <div className="p-4 flex items-center justify-center relative">
        <h2 className="font-bold text-lg dark:text-white">Booking Success</h2>
        <div className="absolute right-4">
        
        </div>
      </div>

      {/* Success Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-4">
          <dotlottie-wc
            src="https://lottie.host/a4efe5f7-194d-429b-8d14-0f7a4e565fc5/HR3EAogwVr.lottie"
            style={{ width: "120px", height: "120px" }}
            speed="1"
            autoplay
            loop="false"
          ></dotlottie-wc>
        </div>
        <div ref={iconRef}>
          <span
            className="material-icons"
            style={{
              color: "green",
              fontSize: 100,
              opacity: 1,
              transition: "opacity 0.8s",
            }}
          >
            check_circle_rounded
          </span>
        </div>
        <div
          className={`transition-opacity duration-600 mt-6 text-2xl font-bold text-neutral dark:text-white text-center ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          Appointment Confirmed!
        </div>
        <div
          className={`transition-opacity duration-800 mt-3 text-base text-gray-600 dark:text-gray-300 text-center ${
            showText ? "opacity-100" : "opacity-0"
          }`}
        >
          Your appointment has been booked successfully.
          <br />
          Returning to home...
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
