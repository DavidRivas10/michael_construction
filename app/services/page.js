import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { IconBrush, IconHouse, IconWrench } from "@/components/Icons";
import { getConfig, listServices } from "@/lib/db";

const ICONS = { interior: IconBrush, exterior: IconHouse, reparacion: IconWrench };

export const metadata = {
  title: "Painting & Repair Services",
  description: "Interior painting, exterior painting, and home repairs in Virginia — one crew, start to finish.",
};

export default function ServicesPage() {
  const config = getConfig();
  const services = listServices();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Services</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Everything your home needs</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          No unknown subcontractors — the same crew that quotes the job is the one that shows up to do it.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex flex-col gap-px overflow-hidden border border-line bg-line">
          {services.map((s) => {
            const Icon = ICONS[s.id] || IconBrush;
            return (
              <div key={s.id} className="grid grid-cols-1 gap-8 bg-white p-9 md:grid-cols-[auto_1fr]">
                <div className="flex h-14 w-14 items-center justify-center bg-paper-2">
                  <Icon className="h-7 w-7 text-gold-dark" />
                </div>
                <div>
                  <h2 className="mb-2 font-display text-2xl font-bold uppercase text-ink">{s.title}</h2>
                  <p className="mb-4 max-w-xl text-[15px] text-ink-soft">{s.shortDesc}</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-ink">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-5 bg-charcoal px-8 py-12 text-center">
          <h3 className="font-display text-2xl font-bold uppercase text-white">Which one do you need?</h3>
          <Link href="/estimate" className="btn-primary">Get My Price</Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
