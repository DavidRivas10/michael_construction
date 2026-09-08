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
import { IconCheck, IconClock, IconHeart, IconBrush, IconHouse, IconWrench, IconStar } from "@/components/Icons";
import { getConfig, listPortfolio, listReviews, listServices, listFaq } from "@/lib/db";

const SERVICE_ICONS = { interior: IconBrush, exterior: IconHouse, reparacion: IconWrench };

export default async function HomePage() {
  const [config, portfolioAll, reviews, services, faq] = await Promise.all([
    getConfig(),
    listPortfolio(),
    listReviews(),
    listServices(),
    listFaq(),
  ]);
  const portfolio = portfolioAll.slice(0, 3);
  const [featured, ...rest] = services;

  return (
    <>
      <SiteHeader config={config} />

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <div className="eyebrow mb-4">Interior &amp; Exterior Painting · Home Repairs</div>
          <h1 className="mb-6 font-display text-5xl font-black uppercase leading-[0.98] text-ink md:text-6xl">
            {config.heroHeadline}
          </h1>
          <p className="mb-8 max-w-md text-lg leading-relaxed text-ink-soft">
            {config.heroSubheadline}
          </p>
          <div className="mb-7 flex flex-wrap gap-4">
            <Link href="/estimate" className="btn-primary">Get a Free Estimate</Link>
            <a href={`tel:${config.phone}`} className="btn-outline">Call Now</a>
          </div>
        </div>

        <div className="relative">
          <div className="placeholder-photo flex h-[420px] items-center justify-center border border-line">
            <div className="text-center">
              <IconHouse className="mx-auto mb-3 h-14 w-14 text-ink/25" />
              <div className="text-sm font-bold text-ink-faint">[Real project photo]</div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 bg-charcoal px-6 py-4 text-white shadow-xl">
            <div className="font-display text-3xl font-bold">{config.yearsInBusiness}+</div>
            <div className="text-xs font-semibold uppercase tracking-wide opacity-80">years serving {config.serviceArea.split(",")[0]}</div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-line bg-paper-2 py-6">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 text-sm font-bold text-ink sm:grid-cols-4">
          <div className="flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark" />Licensed &amp; insured</div>
          <div className="flex items-center gap-2.5"><IconClock className="h-5 w-5 text-gold-dark" />Same-day response</div>
          <div className="flex items-center gap-2.5"><IconHeart className="h-5 w-5 text-gold-dark" />Se habla español</div>
          <div className="flex items-center gap-2.5"><IconCheck className="h-5 w-5 text-gold-dark" />Work guaranteed</div>
        </div>
      </section>

      {/* Services — one featured + two secondary, not three identical cards */}
      <section id="services" className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="mb-14 max-w-xl">
            <div className="eyebrow mb-3">What we do</div>
            <h2 className="font-display text-4xl font-bold uppercase text-ink">One crew for the whole project</h2>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {featured && (
            <Reveal>
              <div className="flex h-full flex-col justify-between border border-line bg-charcoal p-10 text-white">
                <div>
                  <IconBrush className="mb-5 h-9 w-9 text-gold" />
                  <div className="mb-2 font-display text-2xl font-bold uppercase">{featured.title}</div>
                  <p className="mb-6 max-w-sm text-[15px] text-white/70">{featured.shortDesc}</p>
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm text-white/85">
                    {featured.items.map((it) => (
                      <li key={it} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-gold" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/services" className="btn-outline mt-8 w-fit border-white text-white hover:bg-white hover:text-charcoal">
                  See details
                </Link>
              </div>
            </Reveal>
          )}
          <div className="flex flex-col gap-6">
            {rest.map((s, i) => {
              const Icon = SERVICE_ICONS[s.id] || IconBrush;
              return (
                <Reveal key={s.id} delay={i * 90}>
                  <div className="flex h-full flex-col justify-between border border-line bg-white p-7">
                    <div>
                      <Icon className="mb-4 h-7 w-7 text-gold-dark" />
                      <div className="mb-2 font-display text-lg font-bold uppercase text-ink">{s.title}</div>
                      <p className="text-[14.5px] text-ink-soft">{s.shortDesc}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ProcessSteps />

      {/* Portfolio — interactive filter + drag slider */}
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
        <PortfolioGrid items={portfolio} />
      </section>

      <WhyChooseUs />

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
        <TestimonialCarousel reviews={reviews} />
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
          <div className="flex h-64 items-center justify-center border border-line bg-white text-sm font-bold text-ink-faint">
            [Service area map]
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
