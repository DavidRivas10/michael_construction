import Reveal from "./Reveal";
import { IconCheck } from "./Icons";

const POINTS = [
  {
    title: "One crew, start to finish",
    text: "The person who gives you the estimate is the same one who shows up to paint. No unknown subcontractors handed your job.",
  },
  {
    title: "Pricing you can see through",
    text: "Every estimate shows the math behind it — base rate, condition adjustment, any add-ons. You'll never wonder where a number came from.",
  },
  {
    title: "Licensed & insured",
    text: `Active license and insurance in ${"[State]"} — documentation available for your insurer or HOA on request.`,
  },
  {
    title: "Local, and it shows",
    text: "Based in [Your City], VA — familiar with local HOA rules, weather patterns, and the materials that hold up here.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        <Reveal>
          <div className="eyebrow mb-3">Why homeowners choose us</div>
          <h2 className="mb-5 font-display text-4xl font-bold uppercase leading-[1.02] text-ink">
            Not the biggest crew in Virginia — just one you can trust in your home.
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-ink-soft">
            Michael Construction is family-run. That means fewer jobs running at once, and more attention on
            yours — from the first estimate to the final coat.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {POINTS.map((p, i) => (
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
