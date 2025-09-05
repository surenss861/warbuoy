/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        warbuoyBlue: "#0a84ff",
        warbuoyBlack: "#000000"
      }
    }
  },
  plugins: []
};