/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14171C", soft: "#4B5157", faint: "#7B818A" },
        paper: { DEFAULT: "#F6F7F5", 2: "#ECEEEA", 3: "#E3E6E0" },
        line: "#DBDFD9",
        charcoal: { DEFAULT: "#1B1E1B", soft: "#262A26" },
        gold: { DEFAULT: "#B8862E", dark: "#8F6A22", soft: "#F3E7CD" },
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "system-ui", "sans-serif"],
        sans: ["'Public Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
