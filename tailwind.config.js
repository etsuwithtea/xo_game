/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'Sarabun', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        'thai': ['Sarabun', 'Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        'pop-in': 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'celebrate': 'celebrate 0.6s ease-in-out',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        celebrate: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
}

