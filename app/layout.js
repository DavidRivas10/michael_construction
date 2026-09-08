import "./globals.css";

export const metadata = {
  title: "Michael Construction — Pintura y Reparaciones",
  description:
    "Pintura interior y exterior, y reparaciones del hogar en [Your City], VA. Estimado gratis en minutos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
