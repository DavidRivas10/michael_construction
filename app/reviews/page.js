import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { IconStar } from "@/components/Icons";
import { getConfig, listReviews } from "@/lib/db";

export const metadata = {
  title: "Reviews",
  description: "What Virginia homeowners say about working with Michael Construction.",
};

export default function ReviewsPage() {
  const config = getConfig();
  const reviews = listReviews();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Reviews</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">What our clients say</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          These reviews sync directly from Google — Michael never has to copy them by hand.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <TestimonialCarousel reviews={reviews} />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="border border-line bg-white p-6">
              <div className="mb-3 flex gap-0.5 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-3.5 w-3.5" />)}
              </div>
              <p className="mb-3 text-[13.5px] italic leading-relaxed text-ink-soft">"{r.text}"</p>
              <div className="text-sm font-bold text-ink">{r.author}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
