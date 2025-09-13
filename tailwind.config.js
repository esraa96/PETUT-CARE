/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.{js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary_app: "rgb(var(--color-orange-400) / <alpha-value>)",
        secondary: "#4CAF50",
        'petut-brown': {
          100: "#F5E6D3",
          200: "#E8D0B3",
          300: "#D9A741",
          400: "#C4941A",
          500: "#B8860B",
        },
        orange: {
          50: "rgb(var(--color-orange-50) / <alpha-value>)",
          100: "rgb(var(--color-orange-100) / <alpha-value>)",
          200: "rgb(var(--color-orange-200) / <alpha-value>)",
          300: "rgb(var(--color-orange-300) / <alpha-value>)",
          400: "rgb(var(--color-orange-400) / <alpha-value>)",
          500: "rgb(var(--color-orange-500) / <alpha-value>)",
          600: "rgb(var(--color-orange-600) / <alpha-value>)",
          700: "rgb(var(--color-orange-700) / <alpha-value>)",
          800: "rgb(var(--color-orange-800) / <alpha-value>)",
          900: "rgb(var(--color-orange-900) / <alpha-value>)",
        },
      },
      fontFamily: {
        exo: ["Exo", "Exo 2", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "bounce-gentle": "bounceGentle 2s infinite",
        "pulse-gentle": "pulseGentle 2s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      boxShadow: {
        petut: "0 4px 15px rgba(249, 115, 22, 0.3)",
        "petut-lg": "0 10px 30px rgba(249, 115, 22, 0.2)",
        "petut-xl": "0 20px 40px rgba(249, 115, 22, 0.15)",
        "inner-petut": "inset 0 2px 4px rgba(249, 115, 22, 0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        },
        ".text-shadow-lg": {
          textShadow: "4px 4px 8px rgba(0,0,0,0.2)",
        },
        ".glass": {
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".glass-dark": {
          background: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".btn-primary-admin": {
          backgroundColor: "#D9A741",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          border: "1px solid #D9A741",
          cursor: "pointer",
          transition: "all 0.3s ease",
        },
        ".btn-primary-admin:hover": {
          backgroundColor: "transparent",
          color: "#D9A741",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
