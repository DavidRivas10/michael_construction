/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta v6 — alineada con la identidad de marca final aprobada
        // de "Maykar Professional Painting" (guía de marca de
        // septiembre 2026): navy #0E2D57 + naranja vibrante #F47B20
        // como acento cálido ("gold" se mantiene como nombre de clase
        // por compatibilidad, aunque ahora es el naranja de marca).
        // "charcoal" queda igual (azul-marino casi negro, uso interno
        // de fondos oscuros del sitio, no es uno de los 4 colores de
        // marca del PDF de identidad).
        ink: { DEFAULT: "#10151F", soft: "#454C5C", faint: "#7B8394" },
        paper: { DEFAULT: "#FFFFFF", 2: "#F3F4F7", 3: "#E8EAEF" },
        line: "#E1E4EA",
        charcoal: { DEFAULT: "#0A0F1C", soft: "#141C2E" },
        navy: { DEFAULT: "#0E2D57", dark: "#0A2144", light: "#5E6B85", soft: "#EAEDF3" },
        gold: { DEFAULT: "#F47B20", dark: "#CF691B", soft: "#FDEBDE" },
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
