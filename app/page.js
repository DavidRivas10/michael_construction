import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
import SpecialtiesGrid from "@/components/SpecialtiesGrid";
import CtaBanner from "@/components/CtaBanner";
import ProcessSteps from "@/components/ProcessSteps";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { IconCheck, IconClock, IconHeart, IconWhatsapp, IconStar } from "@/components/Icons";
import { getConfig, listReviews, listServices, listFaq } from "@/lib/db";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesTabs from "@/components/ServicesTabs";
import StatsBand from "@/components/StatsBand";

// Fotos usadas como fondo de las tarjetas de servicio en la sección "What we
// do" (pestañas) — fotos reales de public/hero/, distintas a las del
// carrusel del hero y a las del grid de especialidades de más abajo, para
// que ninguna imagen se repita dentro de la misma pantalla.
const SERVICE_PHOTOS = {
  interior: "/hero/service-interior-painting-2.jpg",
  exterior: "/hero/service-exterior-painting-1.jpg",
  reparacion: "/hero/service-home-repairs-2.jpg",
};

export default async function HomePage() {
  const [config, reviews, services, faq] = await Promise.all([
    getConfig(),
    listReviews(),
    listServices(),
    listFaq(),
  ]);
  const whatsappLink = buildWhatsAppLink(config.whatsapp);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <SiteHeader config={config} overHero />

      {/* Hero — foto de fondo con crossfade + Ken Burns (ver HeroCarousel) y,
          a partir de lg:, un panel sólido cortado en diagonal que parte la
          pantalla en dos formas reales (no un degradado parejo). El header
          nace transparente encima de esta sección y se vuelve sólido al
          hacer scroll. La tarjeta de confianza flota sobre la costura con
          la franja de estadísticas, cruzando el borde en vez de ser una
          línea de texto más. */}
      <section className="relative isolate bg-navy-dark text-white">
        <div className="absolute inset-0 overflow-hidden">
          <HeroCarousel className="absolute inset-0 h-full w-full" />
          {/* Panel diagonal — solo desde lg:, donde hay espacio para que el
              corte se lea como una forma y no como un recorte raro. */}
          <div
            className="absolute inset-y-0 left-0 hidden w-[62%] bg-navy-dark lg:block"
            style={{ clipPath: "polygon(0 0, 100% 0, 74% 100%, 0 100%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-t from-black/25 via-transparent to-transparent lg:block"
            style={{ clipPath: "polygon(0 0, 100% 0, 74% 100%, 0 100%)" }}
            aria-hidden="true"
          />
          {/* Cuña diagonal al pie del hero — divisor con forma, no un corte
              recto entre secciones. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-paper sm:h-14"
            style={{ clipPath: "polygon(0 100%, 100% 30%, 100% 100%)" }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[640px] w-full max-w-6xl items-end px-6 pb-24 pt-40 sm:min-h-[88vh] sm:pb-16 lg:min-h-[80vh]">
          <div className="lg:max-w-xl">
            <div className="eyebrow hero-anim mb-4 text-gold" style={{ animationDelay: "150ms" }}>
              Interior &amp; Exterior Painting · Home Repairs
            </div>
            <h1
              className="hero-anim mb-6 max-w-3xl text-balance font-display text-[clamp(2.6rem,6.5vw,4.75rem)] font-black uppercase leading-[0.95]"
              style={{ animationDelay: "280ms" }}
            >
              {config.heroHeadline}
            </h1>
            <p className="hero-anim mb-9 max-w-lg text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-white/80" style={{ animationDelay: "420ms" }}>
              {config.heroSubheadline}
            </p>
            <div className="hero-anim flex flex-wrap gap-4" style={{ animationDelay: "560ms" }}>
              <Link href="/estimate" className="btn-primary">Get a Free Estimate</Link>
              <a
                href={`tel:${config.phone}`}
                className="btn-outline border-white bg-navy-dark/60 text-white backdrop-blur-sm hover:bg-white hover:text-charcoal"
              >
                Call Now
              </a>
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline flex items-center gap-2 border-white bg-navy-dark/60 text-white backdrop-blur-sm hover:bg-white hover:text-charcoal"
                >
                  <IconWhatsapp className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>

            {/* En móvil, donde no cabe la tarjeta flotante de abajo, las
                señales de confianza quedan como línea de texto simple. */}
            <div className="hero-anim mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/15 pt-6 text-[13px] font-semibold text-white/75 sm:hidden" style={{ animationDelay: "680ms" }}>
              <span className="flex items-center gap-2">
                <IconCheck className="h-4 w-4 text-gold" /> Licensed &amp; insured
              </span>
              <span className="flex items-center gap-2">
                <IconClock className="h-4 w-4 text-gold" /> Same-day response
              </span>
            </div>
          </div>
        </div>

        {/* Tarjeta flotante de confianza — de sm: en adelante, superpuesta a
            la costura entre el hero y la franja de estadísticas. */}
        <div className="relative z-10 mx-auto hidden w-full max-w-6xl px-6 sm:block">
          <div className="-mt-9 flex max-w-lg items-stretch divide-x divide-line rounded-sm border border-line bg-white shadow-premium lg:ml-2">
            <div className="flex flex-1 items-center gap-2.5 px-5 py-4">
              <IconCheck className="h-5 w-5 shrink-0 text-gold-dark" />
              <span className="text-[12.5px] font-bold uppercase leading-tight text-ink">Licensed &amp; insured</span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-5 py-4">
              <IconClock className="h-5 w-5 shrink-0 text-gold-dark" />
              <span className="text-[12.5px] font-bold uppercase leading-tight text-ink">Same-day response</span>
            </div>
            <div className="flex flex-1 items-center gap-2.5 px-5 py-4">
              {avgRating ? (
                <>
                  <span className="flex text-gold-dark">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <IconStar key={i} className={`h-3.5 w-3.5 ${i < Math.round(avgRating) ? "" : "opacity-25"}`} />
                    ))}
                  </span>
                  <span className="text-[12.5px] font-bold uppercase leading-tight text-ink">{avgRating}/5 · {reviews.length} reviews</span>
                </>
              ) : (
                <>
                  <IconHeart className="h-5 w-5 shrink-0 text-gold-dark" />
                  <span className="text-[12.5px] font-bold uppercase leading-tight text-ink">{config.yearsInBusiness}+ years</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Franja de estadísticas */}
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

      {/* Before / After — comparador arrastrable con fotos reales, la
          sección visualmente más fuerte del sitio. */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mx-auto mb-3 max-w-xl text-center">
            <div className="eyebrow mb-3">See the difference</div>
            <h2 className="font-display text-4xl font-bold uppercase text-ink">Drag to compare</h2>
          </div>
          <p className="mx-auto mb-12 max-w-md text-center text-sm text-ink-faint">
            Slide the control on each photo — same angle, before and after the crew shows up.
          </p>
        </Reveal>
        <BeforeAfterShowcase location={config.serviceArea} />
      </section>

      {/* Services — layout de pestañas (CMS/admin) */}
      <section id="services" className="relative bg-navy-dark py-24">
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

      {/* Specialties — grid editorial de las cinco especialidades, cada una
          con su propia foto. Presentación puramente visual, no reemplaza
          las pestañas de arriba (esas siguen editables desde /admin). */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mx-auto mb-12 max-w-xl text-center">
            <div className="eyebrow mb-3">Every specialty, one crew</div>
            <h2 className="font-display text-4xl font-bold uppercase text-ink">Five ways we take care of your home</h2>
          </div>
        </Reveal>
        <SpecialtiesGrid />
      </section>

      <ProcessSteps />

      <CtaBanner
        image="/hero/showcase-bedroom-finished.jpg"
        eyebrow="Quality that shows"
        title="A finished room should look like nothing ever happened to it."
        text="Every job — big repaint or small repair — gets the same protected floors, taped edges, and clean finish before we call it done."
        points={["Furniture & floors fully protected", "Daily site clean-up", "Final walkthrough before we leave"]}
      />

      <WhyChooseUs config={config} />

      {/* AI estimator banner */}
      <section className="bg-navy-dark py-20">
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
