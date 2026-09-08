import "./globals.css";
import { getConfig } from "@/lib/db";
import IntroLoader from "@/components/IntroLoader";

// NOTA: intentamos next/font/google (auto-hosting + sin layout shift), pero
// el entorno de build de este sandbox no tiene salida de red hacia Google
// Fonts (verificado con curl — bloqueado por el proxy). En Vercel esto sí
// funciona sin problema. Mientras tanto usamos @import en globals.css, que
// carga en el navegador del visitante y no depende de la red del build.

export const metadata = {
  metadataBase: new URL("https://www.michaelconstruction.com"),
  title: {
    default: "Michael Construction — Painting & Home Repairs in Virginia",
    template: "%s | Michael Construction",
  },
  description:
    "Licensed and insured interior and exterior painting, plus home repairs, in [Your City], VA. Get a free, transparent estimate in minutes.",
  openGraph: {
    type: "website",
    siteName: "Michael Construction",
  },
};

export default function RootLayout({ children }) {
  const config = getConfig();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    name: config.businessName,
    telephone: config.phone,
    email: config.email,
    areaServed: config.serviceArea,
    priceRange: "$$",
    ...(config.licenseState && !config.licenseState.startsWith("[")
      ? { hasCredential: `Licensed in ${config.licenseState}` }
      : {}),
  };

  return (
    <html lang="en">
      <body>
        <IntroLoader businessName={config.businessName} />
        {children}
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
