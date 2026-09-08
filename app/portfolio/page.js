import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getConfig, listPortfolio } from "@/lib/db";

export const metadata = {
  title: "Portfolio",
  description: "Real before-and-after painting and repair projects in Virginia.",
};

export default async function PortfolioPage() {
  const [config, items] = await Promise.all([getConfig(), listPortfolio()]);

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Portfolio</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Real work, real results</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          Michael uploads these photos directly from the admin panel — no developer needed.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <PortfolioGrid items={items} />
      </section>
      <SiteFooter />
    </>
  );
}
