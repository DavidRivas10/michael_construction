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
          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            Fewer jobs running at once means more attention on yours — from the first estimate to the final coat.
          </p>
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