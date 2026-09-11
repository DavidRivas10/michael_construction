import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ReviewForm from "@/components/ReviewForm";
import { IconStar } from "@/components/Icons";
import { getConfig, listReviews } from "@/lib/db";

export const metadata = {
  title: "Reviews",
  description: "What Virginia homeowners say about working with Michael Construction.",
};

export default async function ReviewsPage() {
  const [config, reviews] = await Promise.all([getConfig(), listReviews()]);

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Reviews</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">What our clients say</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          Real feedback from homeowners we've worked with — Michael reads and approves every one personally.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        {reviews.length > 0 ? (
          <>
            <TestimonialCarousel reviews={reviews} />
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
              {reviews.map((r) => {
                const initials = (r.author || "?")
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0]?.toUpperCase())
                  .join("");
                return (
                  <div key={r.id} className="border border-line bg-white p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-soft font-display text-sm font-bold text-gold-dark">
                        {initials || "?"}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-ink">{r.author}</div>
                        <div className="flex gap-0.5 text-gold">
                          {Array.from({ length: r.rating }).map((_, i) => <IconStar key={i} className="h-3 w-3" />)}
                        </div>
                      </div>
                    </div>
                    <p className="text-[13.5px] italic leading-relaxed text-ink-soft">"{r.text}"</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="rounded-sm border border-dashed border-line py-16 text-center text-ink-faint">
            No reviews yet — be the first to share your experience.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ReviewForm />
      </section>
      <SiteFooter />
    </>
  );
}
