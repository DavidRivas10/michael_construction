import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PortfolioGrid from "@/components/PortfolioGrid";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import LeadForm from "@/components/LeadForm";
import { IconCheck, IconClock, IconHeart, IconBrush, IconHouse, IconWrench, IconStar } from "@/components/Icons";
import { getConfig, listPortfolio, listReviews, listServices, listFaq } from "@/lib/db";

const SERVICE_ICONS = { interior: IconBrush, exterior: IconHouse, reparacion: IconWrench };

export default function HomePage() {
  const config = getConfig();
  const portfolio = listPortfolio().slice(0, 3);
  const reviews = listReviews();
  const services = listServices();
  const faq = listFaq();

  return (
    <>
      <SiteHeader config={config} />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <div className="eyebrow mb-4">Pintura interior y exterior · Reparaciones del hogar</div>
          <h1 className="mb-6 font-display text-5xl font-black uppercase leading-[0.98] text-ink md:text-6xl">
            {config.heroHeadline}
          </h1>
          <p className="mb-8 max-w-md text-lg leading-relaxed text-ink-soft">
            {config.heroSubheadline}
          </p>
          <div className="mb-7 flex flex-wrap gap-4">
            <Link href="/estimado" className="btn-primary">Calcular mi precio</Link>
            <a href={`tel:${config.phone}`} className="btn-outline">Llamar ahora</a>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-ink">
            <span className="flex text-gold">
              {Array.from({ length: 5 }).map((_, i) => <IconStar key={i} className="h-4 w-4" />)}
            </span>
            4.9 de 5 · 120+ reseñas locales
            <span className="font-semibold text-ink-faint">(ejemplo)</span>
          </div>
        </div>

        <div className="relative">
          <div className="placeholder-photo flex h-[420px] items-center justify-center border border-line">
            <div className="text-center">
              <IconHouse className="mx-auto mb-3 h-14 w-14 text-ink/25" />
              <div className="text-sm font-bold text-ink-faint">[Foto de un proyecto real]</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-charcoal px-6 py-4 text-white shadow-xl">
            <div className="font-display text-3xl font-bold">{config.yearsInBusiness}+</div>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">años en {config.serviceArea.split(",")[0]}</div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-line bg-paper-2 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-sm font-bold text-ink sm:grid-cols-4">
          <div className="flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark" />Licencia y seguro</div>
          <div className="flex items-center gap-2.5"><IconClock className="h-5 w-5 text-gold-dark" />Respuesta el mismo día</div>
          <div className="flex items-center gap-2.5"><IconHeart className="h-5 w-5 text-gold-dark" />Se habla español</div>
          <div className="flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark" />Trabajo garantizado</div>
        </div>
      </section>

      {/* Services */}
      <section id="servicios" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <div className="eyebrow mb-3">Qué hacemos</div>
          <h2 className="font-display text-4xl font-bold uppercase text-ink">Un solo equipo para todo el proyecto</h2>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
          {services.map((s) => {
            const Icon = SERVICE_ICONS[s.id] || IconBrush;
            return (
              <div key={s.id} className="bg-white p-8">
                <Icon className="mb-4 h-8 w-8 text-gold-dark" />
                <div className="mb-2 font-display text-xl font-bold uppercase text-ink">{s.title}</div>
                <p className="text-[15px] text-ink-soft">{s.shortDesc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Portfolio — interactive filter + drag slider */}
      <section id="portafolio" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mx-auto mb-3 max-w-xl text-center">
          <div className="eyebrow mb-3">Trabajos recientes</div>
          <h2 className="font-display text-4xl font-bold uppercase text-ink">Arrastra para ver la diferencia</h2>
        </div>
        <p className="mx-auto mb-12 max-w-md text-center text-sm text-ink-faint">
          Desliza el control sobre cada foto para comparar el antes y el después.
        </p>
        <PortfolioGrid items={portfolio} />
      </section>

      {/* AI estimator banner */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <div className="text-white">
            <div className="mb-3 text-[13px] font-extrabold uppercase tracking-wide text-gold">Estimador con IA</div>
            <h2 className="mb-4 font-display text-4xl font-bold uppercase">Un precio real, no una adivinanza.</h2>
            <p className="mb-7 max-w-md text-white/75">
              Contesta tres preguntas y ves exactamente cómo se calcula tu rango — tarifa base, ajuste por tamaño y por condición — antes de dejar tus datos.
            </p>
            <Link href="/estimado" className="btn-primary">Ver cómo se calcula</Link>
          </div>
          <div className="border border-white/15 bg-white p-6">
            <div className="mb-3 flex items-center justify-between border-b border-line px-1 pb-3 text-[13px]">
              <span className="text-ink-soft">Tarifa base — Pintura interior, Mediano</span>
              <span className="font-bold text-ink">$1,200–$1,800</span>
            </div>
            <div className="mb-4 flex items-center justify-between px-1 text-[13px]">
              <span className="text-ink-soft">Ajuste por condición (regular)</span>
              <span className="font-bold text-ink">sin cambio</span>
            </div>
            <div className="flex items-center justify-between bg-paper-2 px-5 py-4">
              <span className="text-sm font-bold text-ink">Rango final</span>
              <span className="font-display text-xl font-bold text-gold-dark">$1,200–$1,800</span>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="resenas" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <div className="eyebrow mb-3">Reseñas</div>
          <h2 className="font-display text-4xl font-bold uppercase text-ink">Con la confianza de tus vecinos</h2>
        </div>
        <TestimonialCarousel reviews={reviews} />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="mb-10 text-center">
          <div className="eyebrow mb-3">Preguntas frecuentes</div>
          <h2 className="font-display text-3xl font-bold uppercase text-ink">Antes de que preguntes</h2>
        </div>
        <FaqAccordion items={faq} />
      </section>

      {/* Contact */}
      <section id="contacto" className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-2">
        <div className="border border-line bg-paper-2 p-8">
          <div className="eyebrow mb-3">Área de servicio</div>
          <h3 className="mb-5 font-display text-2xl font-bold uppercase text-ink">{config.serviceArea}</h3>
          <div className="flex h-64 items-center justify-center border border-line bg-white text-sm font-bold text-ink-faint">
            [Mapa del área de servicio]
          </div>
        </div>
        <div className="border border-line bg-white p-8">
          <h3 className="mb-1 font-display text-2xl font-bold uppercase text-ink">Cuéntanos del proyecto</h3>
          <p className="mb-6 text-sm text-ink-faint">Michael responde personalmente, casi siempre el mismo día.</p>
          <LeadForm ctaLabel="Enviar y recibir contacto" />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
