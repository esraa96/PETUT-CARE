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
        primary_app: {
          DEFAULT: "#FF8D4D",
          50: "#FFF7F0",
          100: "#FFEDE0",
          200: "#FFD4B8",
          300: "#FFBB90",
          400: "#FFA268",
          500: "#FF8D4D",
          600: "#FF7A33",
          700: "#E6661A",
          800: "#CC5200",
          900: "#B33E00",
          dark: "#5A282B",
        },
        secondary: {
          DEFAULT: "#FFB9A9",
          50: "#FFF9F7",
          100: "#FFF2EF",
          200: "#FFE5DF",
          300: "#FFD8CF",
          400: "#FFCBBF",
          500: "#FFB9A9",
          600: "#FFA693",
          700: "#FF937D",
          800: "#FF8067",
          900: "#FF6D51",
          light: "#FFEFE9",
          dark: "#1E202D",
        },
        accent: {
          DEFAULT: "#FF5464",
          50: "#FFF0F1",
          100: "#FFE1E3",
          200: "#FFC3C7",
          300: "#FFA5AB",
          400: "#FF878F",
          500: "#FF5464",
          600: "#FF3648",
          700: "#FF182C",
          800: "#FA0010",
          900: "#DC0009",
        },
        neutral: {
          DEFAULT: "#5A282B",
          50: "#F8F4F4",
          100: "#F1E9EA",
          200: "#E3D3D5",
          300: "#D5BDC0",
          400: "#C7A7AB",
          500: "#B99196",
          600: "#A67B81",
          700: "#93656C",
          800: "#804F57",
          900: "#5A282B",
        },
        petut: {
          orange: {
            50: "#FFF7ED",
            100: "#FFEDD5",
            200: "#FED7AA",
            300: "#FDBA74",
            400: "#FB923C",
            500: "#F97316",
            600: "#EA580C",
            700: "#C2410C",
            800: "#9A3412",
            900: "#7C2D12",
          },
          brown: {
            50: "#FDFCFB",
            100: "#F7F3EB",
            200: "#E6D5B7",
            300: "#D9A741",
            400: "#C19635",
            500: "#A8852A",
            600: "#8F741E",
            700: "#766313",
            800: "#5D5207",
            900: "#444100",
          },
        },
      },
      fontFamily: {
        exo: ["Exo", "Exo 2", "sans-serif"],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-gentle': 'pulseGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      boxShadow: {
        'petut': '0 4px 15px rgba(249, 115, 22, 0.3)',
        'petut-lg': '0 10px 30px rgba(249, 115, 22, 0.2)',
        'petut-xl': '0 20px 40px rgba(249, 115, 22, 0.15)',
        'inner-petut': 'inset 0 2px 4px rgba(249, 115, 22, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        },
        '.text-shadow-lg': {
          textShadow: '4px 4px 8px rgba(0,0,0,0.2)',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};