/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html", // Corrected path to your index.html file
    "./src/**/*.{js,jsx,ts,tsx}", // This will cover all files in your src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
