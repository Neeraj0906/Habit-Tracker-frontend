/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Default font
      },
      colors: {
        primary: '#646cff', // Custom primary color
        secondary: '#535bf2', // Custom secondary color
      },
    },
  },
  plugins: [],
};