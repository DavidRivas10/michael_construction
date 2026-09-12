/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta v5 — alineada con la identidad de marca definitiva
        // (roofline mark azul-marino + gris + wordmark "MICHAEL
        // CONSTRUCTION"). "charcoal" pasa de negro neutro a un
        // azul-marino casi negro (mismo tono que el ícono del logo), y se
        // suma "navy" como color de marca de rango medio para acentos,
        // bordes y detalles — junto al naranja ("gold") como único color
        // de acento cálido, igual que antes. Los nombres de clase se
        // mantienen a propósito para no tocar cada componente.
        ink: { DEFAULT: "#10151F", soft: "#454C5C", faint: "#7B8394" },
        paper: { DEFAULT: "#FFFFFF", 2: "#F3F4F7", 3: "#E8EAEF" },
        line: "#E1E4EA",
        charcoal: { DEFAULT: "#0A0F1C", soft: "#141C2E" },
        navy: { DEFAULT: "#1C2D4A", dark: "#121D33", light: "#5E6B85", soft: "#EAEDF3" },
        gold: { DEFAULT: "#FF5A1F", dark: "#D9450F", soft: "#FFE3D3" },
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "system-ui", "sans-serif"],
        sans: ["'Public Sans'", "system-ui", "sans-serif"],
      },
      boxShadow: {
        premium: "0 30px 70px -30px rgba(10,15,28,0.35)",
      },
    },
  },
  plugins: [],
};
