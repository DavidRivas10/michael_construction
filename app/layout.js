import "./globals.css";
import { getConfig } from "@/lib/db";
import IntroLoader from "@/components/IntroLoader";

// El sitio ahora depende de Supabase (una base de datos real) en vez de
// archivos JSON locales, así que ya no se puede "congelar" en HTML durante
// el build — cada visita necesita una consulta fresca. `force-dynamic` en el
// layout raíz aplica a todas las páginas del sitio (públicas y admin).
export const dynamic = "force-dynamic";
// Ver el comentario en lib/supabaseClient.js -- force-dynamic por si solo no
// garantiza que cada fetch() individual (como los de supabase-js) evite el
// cache de datos de Next.js/Vercel. fetchCache = "force-no-store" lo hace
// explicito a nivel de segmento de ruta, para toda la app.
export const fetchCache = "force-no-store";

// NOTA: intentamos next/font/google (auto-hosting + sin layout shift), pero
// el entorno de build de este sandbox no tiene salida de red hacia Google
// Fonts (verificado con curl — bloqueado por el proxy). En Vercel esto sí
// funciona sin problema. Mientras tanto usamos @import en globals.css, que
// carga en el navegador del visitante y no depende de la red del build.

// NEXT_PUBLIC_SITE_URL: set this in Vercel once the final custom domain is
// bought and connected. Until then it falls back to the current live
// deployment URL, so SEO metadata is always accurate instead of pointing at
// a domain nobody owns yet.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://michael-construction.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Maykar Professional Painting — Painting & Home Repairs in Virginia",
    template: "%s | Maykar Professional Painting",
  },
  description:
    "Interior and exterior painting, plus home repairs. Clear, transparent pricing — get a free estimate in minutes.",
  openGraph: {
    type: "website",
    siteName: "Maykar Professional Painting",
  },
};

export default async function RootLayout({ children }) {
  const config = await getConfig();

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