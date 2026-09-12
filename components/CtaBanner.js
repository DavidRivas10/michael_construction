import Link from "next/link";
import Reveal from "./Reveal";
import { IconCheck } from "./Icons";

// Banner de foto entre secciones de texto — el "respiro visual" que separa
// el proceso (arriba) de por qué elegirlos (abajo). A partir de lg: la foto
// se recorta en diagonal y ocupa solo la parte derecha, dejando un panel
// sólido en navy a la izquierda para el texto — un split real, no un fondo
// parejo con degradado detrás de todo. object-position fija en el
// centro-alto de la habitación para que el recorte nunca corte la
// cama/ventana en móvil.
export default function CtaBanner({ image, eyebrow, title, text, ctaHref = "/estimate", ctaLabel = "Get a Free Estimate", points = [] }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-dark py-28 sm:py-36">
      <div className="absolute inset-y-0 right-0 w-full lg:w-[58%] lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-[50%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/92 via-navy-dark/70 to-navy-dark/35 lg:from-navy-dark/55 lg:via-navy-dark/15 lg:to-transparent" />
      </div>
      {/* Cuña dorada en la esquina — acento de forma sólido, en vez de que
          la única variación visual del bloque sea el degradado. */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-0 w-0 opacity-90"
        style={{ borderBottom: "110px solid #FF5A1F", borderLeft: "110px solid transparent" }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="max-w-lg">
          {eyebrow && <div className="eyebrow mb-3 text-gold">{eyebrow}</div>}
          <h2 className="mb-5 font-display text-[clamp(2rem,4.2vw,3.2rem)] font-bold uppercase leading-[1.02] text-white">
            {title}
          </h2>
          {text && <p className="mb-7 text-[15px] leading-relaxed text-white/75">{text}</p>}
          {points.length > 0 && (
            <ul className="mb-8 flex flex-col gap-2.5">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2.5 text-sm font-semibold text-white/90">
                  <IconCheck className="h-4 w-4 shrink-0 text-gold" />
                  {p}
                </li>
              ))}
            </ul>
          )}
          <Link href={ctaHref} className="btn-primary">{ctaLabel}</Link>
        </Reveal>
      </div>
    </section>
  );
}
