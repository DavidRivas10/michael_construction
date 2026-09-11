import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PortfolioGrid from "@/components/PortfolioGrid";
import ProcessSteps from "@/components/ProcessSteps";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { IconCheck, IconClock, IconHeart, IconWhatsapp } from "@/components/Icons";
import { getConfig, listPortfolio, listReviews, listServices, listFaq } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesTabs from "@/components/ServicesTabs";
import StatsBand from "@/components/StatsBand";

// Fotos usadas como fondo de las tarjetas de servicio en la sección "What we
// do" — mismas fotos del carrusel del hero (public/hero/). Cuando Michael
// tenga fotos propias por servicio, basta con reemplazar estos archivos.
const SERVICE_PHOTOS = {
  interior: "/hero/interior-living.jpg",
  exterior: "/hero/exterior-house.jpg",
  reparacion: "/hero/painting-ceiling.jpg",
};

export default async function HomePage() {
  const [config, portfolioAll, reviews, services, faq] = await Promise.all([
    getConfig(),
    listPortfolio(),
    listReviews(),
    listServices(),
    listFaq(),
  ]);
  // Los proyectos sin ninguna foto nunca se muestran en el sitio público —
  // se filtran antes de tomar los primeros 3, para que el home siempre
  // intente mostrar 3 proyectos reales en vez de huecos vacíos.
  const portfolioWithPhotos = portfolioAll.filter((p) => p.beforeUrl || p.afterUrl);
  const portfolio = portfolioWithPhotos.slice(0, 3);
  const whatsappLink = buildWhatsAppLink(config.whatsapp);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <SiteHeader config={config} />

      {/* Hero — foto de fondo a toda la pantalla con el titular superpuesto,
          en vez de una fotito chica a un lado. Es el patrón que se repite en
          todas las plantillas de servicios para el hogar que revisamos:
          la imagen ES el fondo, no un elemento decorativo aparte. */}
      <section className="relative isolate flex min-h-[640px] items-end overflow-hidden bg-charcoal text-white sm:min-h-[86vh]">
        <HeroCarousel className="absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/25" />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-20 pt-36 sm:pb-24">
          {/* Entrada escalonada — cada línea aparece un poco después que la
              anterior en vez de que todo el hero aparezca de golpe. */}
          <div className="eyebrow hero-anim mb-4 text-gold" style={{ animationDelay: "150ms" }}>
            Interior &amp; Exterior Painting · Home Repairs
          </div>
          <h1
            className="hero-anim mb-6 max-w-3xl font-display text-6xl font-black uppercase leading-[0.94] md:text-7xl"
            style={{ animationDelay: "280ms" }}
          >
            {config.heroHeadline}
          </h1>
          <p className="hero-anim mb-9 max-w-lg text-lg leading-relaxed text-white/80" style={{ animationDelay: "420ms" }}>
            {config.heroSubheadline}
          </p>
          <div className="hero-anim flex flex-wrap gap-4" style={{ animationDelay: "560ms" }}>
            <Link href="/estimate" className="btn-primary">Get a Free Estimate</Link>
            <a href={`tel:${config.phone}`} className="btn-outline border-white text-white hover:bg-white hover:text-charcoal">
              Call Now
            </a>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2 border-white text-white hover:bg-white hover:text-charcoal"
              >
                <IconWhatsapp className="h-4 w-4" /> WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Cuña diagonal al pie del hero — el detalle de "divisor con forma"
            que se repite en todas las plantillas de referencia, en vez de un
            corte recto entre secciones. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-paper sm:h-14"
          style={{ clipPath: "polygon(0 100%, 100% 30%, 100% 100%)" }}
        />
      </section>

      {/* Franja de estadísticas — banda oscura con ícono en círculo naranja +
          número grande blanco por columna, el patrón de "counter section"
          de las plantillas de referencia, en vez de texto plano sobre fondo
          claro. Los íconos aparecen con rebote y los números cuentan hacia
          arriba al entrar en pantalla (ver components/StatsBand.js). */}
      <StatsBand
        yearsInBusiness={config.yearsInBusiness}
        avgRating={avgRating}
        reviewCount={reviews.length}
      />

      {/* Trust bar */}
      <section className="border-b border-line bg-paper-2 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-sm font-bold text-ink sm:grid-cols-4">
          <div className="group flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark transition-transform duration-200 group-hover:scale-[1.15] group-hover:-rotate-[4deg]" />Free estimates</div>
          <div className="group flex items-center gap-2.5"><IconClock className="h-5 w-5 text-gold-dark transition-transform duration-200 group-hover:scale-[1.15] group-hover:-rotate-[4deg]" />Same-day response</div>
          <div className="group flex items-center gap-2.5"><IconHeart className="h-5 w-5 text-gold-dark transition-transform duration-200 group-hover:scale-[1.15] group-hover:-rotate-[4deg]" />Clear, upfront pricing</div>
          <div className="group flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark transition-transform duration-200 group-hover:scale-[1.15] group-hover:-rotate-[4deg]" />Work guaranteed</div>
        </div>
      </section>

      {/* Portfolio — moved up front, right after the trust bar. This is what
          visitors come to check first for a painting/repair business, so it
          shouldn't be buried below services and the process steps. */}
      <section id="portfolio" className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mx-auto mb-3 max-w-xl text-center">
            <div className="eyebrow mb-3">Recent work</div>
            <h2 className="font-display text-4xl font-bold uppercase text-ink">Drag to see the difference</h2>
          </div>
          <p className="mx-auto mb-12 max-w-md text-center text-sm text-ink-faint">
            Slide the control on each photo to compare before and after.
          </p>
        </Reveal>
        {portfolio.length > 0 ? (
          <PortfolioGrid items={portfolio} />
        ) : (
          <div className="rounded-sm border border-dashed border-line py-16 text-center text-ink-faint">
            Photos of recent projects are coming soon.
          </div>
        )}
      </section>

      {/* Services — layout de pestañas (click en el título de la izquierda
          cambia la foto y los detalles de la derecha) en vez de tres
          tarjetas iguales. Es un patrón de UI distinto, no solo un
          repintado, y es el que más se repite en las plantillas de
          construcción/reparación que sirvieron de referencia. */}
      <section id="services" className="relative bg-charcoal py-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-paper sm:h-14"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)" }}
        />
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-14 max-w-xl">
              <div className="eyebrow mb-3">What we do</div>
              <h2 className="font-display text-4xl font-bold uppercase text-white">One crew for the whole project</h2>
            </div>
          </Reveal>
          <Reveal>
            <ServicesTabs services={services} photos={SERVICE_PHOTOS} />
          </Reveal>
        </div>
      </section>

      <ProcessSteps />

      <WhyChooseUs config={config} />

      {/* AI estimator banner */}
      <section className="bg-charcoal py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
          <Reveal>
            <div className="text-white">
              <div className="mb-3 text-[13px] font-extrabold uppercase tracking-wide text-gold">AI Estimator</div>
              <h2 className="mb-4 font-display text-4xl font-bold uppercase">A real price, not a guess.</h2>
              <p className="mb-7 max-w-md text-white/75">
                Answer three questions and see exactly how your range is calculated — base rate, size, and condition — before leaving your info.
              </p>
              <Link href="/estimate" className="btn-primary">See how it's calculated</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="border border-white/15 bg-white p-6">
              <div className="mb-3 flex items-center justify-between border-b border-line px-1 pb-3 text-[13px]">
                <span className="text-ink-soft">Base rate — Interior painting, Medium</span>
                <span className="font-bold text-ink">$1,200–$1,800</span>
              </div>
              <div className="mb-4 flex items-center justify-between px-1 text-[13px]">
                <span className="text-ink-soft">Condition adjustment (fair)</span>
                <span className="font-bold text-ink">no change</span>
              </div>
              <div className="flex items-center justify-between bg-paper-2 px-5 py-4">
                <span className="text-sm font-bold text-ink">Estimated range</span>
                <span className="font-display text-xl font-bold text-gold-dark">$1,200–$1,800</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mx-auto mb-14 max-w-xl text-center">
            <div className="eyebrow mb-3">Reviews</div>
            <h2 className="font-display text-4xl font-bold uppercase text-ink">Trusted by your neighbors</h2>
          </div>
        </Reveal>
        {reviews.length > 0 ? (
          <TestimonialCarousel reviews={reviews} />
        ) : (
          <div className="mx-auto max-w-md rounded-sm border border-dashed border-line py-16 text-center text-ink-faint">
            No reviews yet — <Link href="/reviews" className="font-semibold text-gold-dark underline">be the first to leave one</Link>.
          </div>
        )}
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Reveal>
          <div className="mb-10 text-center">
            <div className="eyebrow mb-3">FAQ</div>
            <h2 className="font-display text-3xl font-bold uppercase text-ink">Before you ask</h2>
          </div>
        </Reveal>
        <FaqAccordion items={faq} />
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-24 md:grid-cols-2">
        <div className="border border-line bg-paper-2 p-8">
          <div className="eyebrow mb-3">Service area</div>
          <h3 className="mb-5 font-display text-2xl font-bold uppercase text-ink">{config.serviceArea}</h3>
          <div className="h-64 overflow-hidden border border-line bg-white">
            <ServiceAreaMap config={config} className="h-full w-full" />
          </div>
        </div>
        <div className="border border-line bg-white p-8">
          <h3 className="mb-1 font-display text-2xl font-bold uppercase text-ink">Tell us about your project</h3>
          <p className="mb-6 text-sm text-ink-faint">Michael responds personally, almost always the same day.</p>
          <LeadForm ctaLabel="Send & get in touch" showUrgencyCheckbox />
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
