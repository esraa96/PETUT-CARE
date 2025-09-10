import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // On mount, set theme from localStorage or system preference
    const theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:text-primary_app dark:hover:text-primary_app hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
    >
      <div className="relative w-6 h-6">
        {/* Sun icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 7a5 5 0 100 10 5 5 0 000-10z"
          />
        </svg>
        {/* Moon icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      </div>
    </button>
  );
};

export default DarkModeToggle;
