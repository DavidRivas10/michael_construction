import Reveal from "./Reveal";
import { IconCheck } from "./Icons";

function buildPoints(config) {
  const area = config?.serviceArea?.trim();
  const localLine =
    area && !area.startsWith("[")
      ? `Based in ${area} — familiar with the area, the weather, and what actually holds up here.`
      : "Local, and familiar with the area — the weather, the materials, and what actually holds up here.";

  return [
    {
      title: "One crew, start to finish",
      text: "The person who gives you the estimate is the same one who shows up to do the work. No unknown subcontractors handed your job.",
    },
    {
      title: "Pricing you can see through",
      text: "Every estimate shows the math behind it — base rate, condition adjustment, any add-ons. You'll never wonder where a number came from.",
    },
    {
      title: "Clean, respectful work",
      text: "Floors and furniture protected, job site cleaned up daily. Treating your home like it's the one being worked on — because it is.",
    },
    {
      title: "Local, and it shows",
      text: localLine,
    },
  ];
}

export default function WhyChooseUs({ config }) {
  const points = buildPoints(config);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="eyebrow mb-3">Why homeowners choose us</div>
          <h2 className="mb-5 font-display text-4xl font-bold uppercase leading-[1.02] text-ink">
            Not the biggest crew around — just one you can trust in your home.
          </h2>
          <p className="mb-8 max-w-md text-[15px] leading-relaxed text-ink-soft">
            Fewer jobs running at once means more attention on yours — from the first estimate to the final coat.
          </p>

          {/* Foto de un trabajo terminado, con un pequeño marco/acento en vez
              de una imagen suelta — ancla el texto "por qué confiar" a un
              resultado real en vez de dejarlo como un bloque solo de texto. */}
          <div className="relative hidden max-w-md sm:block">
            <div className="absolute -left-3 -top-3 h-full w-full border-2 border-gold/40" aria-hidden="true" />
            {/* Esquina superior izquierda cortada en diagonal, con una cuña
                sólida naranja llenando el corte — el mismo lenguaje de
                forma que el grid de especialidades, no un rectángulo con
                borde y ya. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/showcase-kitchen-finished-sm.jpg"
              alt="Finished kitchen repaint with clean white cabinetry"
              loading="lazy"
              decoding="async"
              className="relative w-full object-cover shadow-premium"
              style={{ aspectRatio: "4 / 3", clipPath: "polygon(36px 0, 100% 0, 100% 100%, 0 100%, 0 36px)" }}
            />
            <div
              className="pointer-events-none absolute left-0 top-0 z-10 h-0 w-0 opacity-95"
              style={{ borderTop: "36px solid #FF5A1F", borderRight: "36px solid transparent" }}
              aria-hidden="true"
            />
            {/* Insignia circular superpuesta a la esquina de la foto — un
                acento con forma propia además del marco dorado, para que
                el bloque no dependa solo de un rectángulo con borde. */}
            <div className="absolute -bottom-5 -right-5 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-paper bg-navy-dark text-center shadow-premium">
              <IconCheck className="h-5 w-5 text-gold" />
              <span className="mt-1 px-2 text-[10px] font-extrabold uppercase leading-tight tracking-wide text-white">
                Satisfaction guaranteed
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full bg-white p-7">
                <IconCheck className="mb-3 h-6 w-6 text-gold-dark" />
                <h3 className="mb-1.5 font-display text-base font-bold uppercase text-ink">{p.title}</h3>
                <p className="text-[14px] leading-relaxed text-ink-soft">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
