/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2563eb', // blue-600 (default primary button)
          primaryHover: '#1d4ed8', // blue-700 (default primary button hover)
          gradientStart: '#ec4899', // pink-500 (active tab start)
          gradientEnd: '#f43f5e', // rose-500 (active tab end)
        }
      }
    },
  },
  plugins: [],
}


