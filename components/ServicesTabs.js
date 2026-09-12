"use client";

import { useState } from "react";
import Link from "next/link";
import { IconBrush, IconHouse, IconWrench, IconCheck, IconArrowRight } from "./Icons";

// Mapa de íconos por id de servicio — vive aquí, no en el server component
// que llama a este componente. React Server Components no puede pasar
// funciones (como un componente de ícono) como prop a un "use client": solo
// puede serializar datos planos (strings, números, JSX ya resuelto). Por
// eso el intento anterior de pasar un objeto {interior: IconBrush, ...}
// como prop rompía con "Functions cannot be passed directly to Client
// Components". Los íconos se resuelven acá adentro, en el mismo archivo que
// ya es "use client".
const SERVICE_ICONS = { interior: IconBrush, exterior: IconHouse, reparacion: IconWrench };

// Layout de pestañas para "What we do": una lista vertical de servicios a la
// izquierda (click cambia la selección) y a la derecha la foto grande +
// descripción + lista de lo que incluye del servicio activo. Patrón de UI
// real distinto al de tres tarjetas iguales — es el que se repite en las
// plantillas de construcción de referencia.
export default function ServicesTabs({ services, photos }) {
  const [active, setActive] = useState(0);
  if (!services?.length) return null;
  const current = services[active];
  const Icon = SERVICE_ICONS[current.id] || IconBrush;
  const photo = photos[current.id];

  return (
    <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-sm border border-white/10 lg:grid-cols-[0.9fr_1.4fr]">
      <div className="flex flex-row overflow-x-auto border-b border-white/10 bg-charcoal-soft no-scrollbar lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r">
        {services.map((s, i) => {
          const TabIcon = SERVICE_ICONS[s.id] || IconBrush;
          const isActive = i === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={`group flex shrink-0 items-center gap-3 border-l-[3px] px-6 py-5 text-left transition lg:shrink lg:w-full ${
                isActive
                  ? "border-gold bg-white/[0.04] text-white"
                  : "border-transparent text-white/55 hover:border-white/20 hover:bg-white/[0.02] hover:text-white/85"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform duration-300 ${
                  isActive ? "scale-100 bg-gold text-charcoal" : "scale-100 bg-white/10 text-white/70 group-hover:scale-105"
                }`}
              >
                <TabIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="whitespace-nowrap font-display text-base font-bold uppercase tracking-wide lg:whitespace-normal">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-end overflow-hidden bg-charcoal-soft sm:min-h-[460px] lg:[clip-path:polygon(0_44px,44px_0,100%_0,100%_100%,0_100%)]">
        {photo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={current.id}
            src={photo}
            alt=""
            className="svc-img-enter absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/10" />

        <div key={current.id} className="svc-content-enter relative p-8 sm:p-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold">
            <Icon className="h-5 w-5 text-charcoal" />
          </div>
          <h3 className="mb-2 font-display text-3xl font-bold uppercase text-white">{current.title}</h3>
          <p className="mb-5 max-w-md text-[14.5px] leading-relaxed text-white/75">{current.shortDesc}</p>

          {current.items?.length > 0 && (
            <ul className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {current.items.slice(0, 6).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-white/85">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          )}

          <Link href="/services" className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-wide text-gold hover:text-white">
            View details <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}