/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: {
    colors: { brand: { 50: "#eefcf7", 100: "#d6f7eb", 500: "#12b886", 600: "#099268", 900: "#064e3b" } },
    fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
    boxShadow: { soft: "0 18px 60px rgba(15, 23, 42, .08)" }
  }},
  plugins: []
};
