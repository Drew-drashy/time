/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Important for your /src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
