"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { IconArrowRight, IconBrush, IconHouse, IconWrench } from "./Icons";

// Grid editorial tipo "bento" — una tarjeta grande y cuatro más chicas de
// distinto tamaño, no cinco cajas idénticas en fila. Cubre las cinco
// especialidades que Michael ofrece (dos de pintura, tres de reparación)
// con su propia fotografía real, sin tocar el modelo de datos de
// "services" que usa la pestaña de arriba (esa sigue viniendo de
// Supabase/admin) — esta sección es puramente de presentación.
//
// Tres de las cinco tarjetas llevan una esquina cortada en diagonal
// (clip-path), cada una en una esquina distinta, y un acento sólido en
// naranja/dorado exactamente donde quedó el corte — no es solo "una
// esquina redondeada distinta", es una forma de color real, el mismo
// lenguaje visual de las referencias (paneles/cuñas sólidas, no solo
// rectángulos con hover).
const ITEMS = [
  {
    area: "big",
    cut: "tr",
    title: "Exterior Painting",
    text: "Siding, trim, and facades — prepped, primed and finished to hold up through every season.",
    img: "/hero/service-exterior-painting-2.jpg",
    icon: IconHouse,
    href: "/services",
  },
  {
    area: "int",
    cut: null,
    title: "Interior Painting",
    text: "Walls, ceilings, trim and cabinets, with clean lines and even coverage.",
    img: "/hero/service-interior-painting-1.jpg",
    icon: IconBrush,
    href: "/services",
  },
  {
    area: "rep",
    cut: "bl",
    title: "Home Repairs",
    text: "The fixes most contractors skip — handled by the same crew that paints your home.",
    img: "/hero/service-home-repairs-1.jpg",
    icon: IconWrench,
    href: "/services",
  },
  {
    area: "extrep",
    cut: null,
    title: "Exterior Repairs",
    text: "Rotted trim, damaged siding, porch columns — replaced and sealed properly.",
    img: "/hero/service-exterior-repairs-2.jpg",
    icon: IconWrench,
    href: "/services",
  },
  {
    area: "intrep",
    cut: "tl",
    title: "Interior Repairs",
    text: "Drywall patches, baseboards, and trim carpentry — finished so the repair disappears.",
    img: "/hero/service-interior-repairs-1.jpg",
    icon: IconWrench,
    href: "/services",
  },
];

// Estilo del triángulo sólido que llena exactamente el hueco del corte —
// border-trick clásico (dos bordes, uno transparente) en vez de una imagen
// o un SVG extra.
const WEDGE = {
  tr: { corner: "right-0 top-0", style: { borderTop: "38px solid #FF5A1F", borderLeft: "38px solid transparent" } },
  bl: { corner: "bottom-0 left-0", style: { borderBottom: "38px solid #FF5A1F", borderRight: "38px solid transparent" } },
  tl: { corner: "left-0 top-0", style: { borderTop: "38px solid #FF5A1F", borderRight: "38px solid transparent" } },
};

function Tile({ item, className = "" }) {
  const Icon = item.icon;
  const cutClass = item.cut ? `specialty-cut-${item.cut}` : "";
  const wedge = item.cut ? WEDGE[item.cut] : null;
  return (
    <Link
      href={item.href}
      className={`group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-sm ${cutClass} ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.img}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full scale-100 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/95 via-navy-dark/45 to-transparent transition-colors duration-500 group-hover:from-navy-dark/97" />
      {wedge && (
        <div
          className={`pointer-events-none absolute z-10 h-0 w-0 opacity-95 ${wedge.corner}`}
          style={wedge.style}
          aria-hidden="true"
        />
      )}
      <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-charcoal">
        <Icon className="h-4 w-4" />
      </div>
      <div className="relative p-5 sm:p-6">
        <h3 className="font-display text-xl font-bold uppercase leading-tight text-white sm:text-2xl">
          {item.title}
        </h3>
        {/* Texto siempre visible (a media opacidad) en vez de aparecer solo
            al hover — el hover ahora solo lo intensifica, para que la
            tarjeta no se sienta vacía hasta que alguien pase el mouse. */}
        <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-white/65 transition-colors duration-300 group-hover:text-white/95 sm:text-[13.5px]">
          {item.text}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-gold opacity-90">
          Explore <IconArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function SpecialtiesGrid() {
  return (
    <div className="specialties-grid">
      {ITEMS.map((item, i) => (
        // El área del grid vive en este <div> nativo (no en Reveal) para
        // que la regla CSS de abajo, con alcance de styled-jsx, tenga la
        // certeza de aplicarse — Reveal es un componente aparte y
        // styled-jsx solo puede garantizar su clase de alcance sobre
        // elementos definidos literalmente en este archivo.
        <div key={item.area} className={`specialty-cell specialty-${item.area}`}>
          <Reveal delay={i * 70} className="h-full">
            <Tile item={item} className="h-full" />
          </Reveal>
        </div>
      ))}

      <style jsx>{`
        .specialties-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .specialties-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .specialties-grid {
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 220px);
            grid-template-areas:
              "big big int"
              "big big rep"
              "extrep intrep intrep";
            gap: 1.1rem;
          }
          .specialty-big { grid-area: big; }
          .specialty-int { grid-area: int; }
          .specialty-rep { grid-area: rep; }
          .specialty-extrep { grid-area: extrep; }
          .specialty-intrep { grid-area: intrep; }
        }
        /* Tres esquinas distintas cortadas en diagonal — ver WEDGE/cut en
           Tile(). clip-path va en elementos globales (no styled-jsx con
           scope) porque Tile vive fuera de este bloque de estilos. */
        :global(.specialty-cut-tr) {
          clip-path: polygon(0 0, calc(100% - 38px) 0, 100% 38px, 100% 100%, 0 100%);
        }
        :global(.specialty-cut-bl) {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 38px 100%, 0 calc(100% - 38px));
        }
        :global(.specialty-cut-tl) {
          clip-path: polygon(38px 0, 100% 0, 100% 100%, 0 100%, 0 38px);
        }
      `}</style>
    </div>
  );
}
