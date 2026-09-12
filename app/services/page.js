import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { IconBrush, IconHouse, IconWrench } from "@/components/Icons";
import { getConfig, listServices } from "@/lib/db";

const ICONS = { interior: IconBrush, exterior: IconHouse, reparacion: IconWrench };

// Mismas fotos que la sección "What we do" del home y el carrusel del hero
// (public/hero/) — mantiene consistencia visual entre páginas.
const SERVICE_PHOTOS = {
  interior: "/hero/service-interior-painting-1.jpg",
  exterior: "/hero/service-exterior-painting-1.jpg",
  reparacion: "/hero/service-home-repairs-1.jpg",
};

export const metadata = {
  title: "Painting & Repair Services",
  description: "Interior painting, exterior painting, and home repairs in Virginia — one crew, start to finish.",
};

export default async function ServicesPage() {
  const [config, services] = await Promise.all([getConfig(), listServices()]);

  return (
    <>
      <SiteHeader config={config} />
      <section className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Services</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Everything your home needs</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          No unknown subcontractors — the same crew that quotes the job is the one that shows up to do it.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="flex flex-col gap-8">
          {services.map((s, i) => {
            const Icon = ICONS[s.id] || IconBrush;
            const photo = SERVICE_PHOTOS[s.id];
            const reversed = i % 2 === 1;
            return (
              <div
                key={s.id}
                className={`grid grid-cols-1 overflow-hidden border border-line bg-white shadow-[0_20px_45px_-30px_rgba(20,23,28,0.4)] md:grid-cols-2 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="group relative h-56 overflow-hidden md:h-auto">
                  {photo && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photo}
                      alt={s.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center p-9">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center bg-paper-2">
                    <Icon className="h-6 w-6 text-gold-dark" />
                  </div>
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

        <div className="mt-14 flex flex-col items-center gap-5 bg-navy-dark px-8 py-12 text-center">
          <h3 className="font-display text-2xl font-bold uppercase text-white">Which one do you need?</h3>
          <Link href="/estimate" className="btn-primary">Get My Price</Link>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
