/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta v4 — pasa de un tono cálido (crema + dorado + carbón cálido)
        // a uno frío y de alto contraste (blanco puro + naranja de seguridad
        // + azul-negro industrial), el patrón que se repite en las
        // plantillas de referencia de construcción/reparación. Los nombres
        // de clase ("gold", "charcoal") se mantienen a propósito — así este
        // único archivo repinta todo el sitio sin tocar cada componente.
        ink: { DEFAULT: "#0F1115", soft: "#464C58", faint: "#7A8090" },
        paper: { DEFAULT: "#FFFFFF", 2: "#F2F3F6", 3: "#E7E9EE" },
        line: "#E1E3E9",
        charcoal: { DEFAULT: "#0A0C12", soft: "#151822" },
        gold: { DEFAULT: "#FF5A1F", dark: "#D9450F", soft: "#FFE3D3" },
      },
      fontFamily: {
        display: ["'Big Shoulders Display'", "system-ui", "sans-serif"],
        sans: ["'Public Sans'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
