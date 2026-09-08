import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EstimatorWizard from "@/components/EstimatorWizard";
import { getConfig } from "@/lib/db";

export const metadata = {
  title: "Free AI Estimate",
  description: "Get a transparent, itemized price range for your painting or repair project in minutes.",
};

export default async function EstimatePage() {
  const config = await getConfig();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-16 text-center">
        <div className="eyebrow mb-3">Free Estimate · No Obligation</div>
        <h1 className="mb-3 font-display text-4xl font-black uppercase text-ink md:text-5xl">
          Find your price before you call anyone
        </h1>
        <p className="mx-auto max-w-lg text-ink-soft">
          Answer a few quick questions and see exactly how your price range is calculated.
        </p>
      </section>

      <section className="px-6 pb-24 pt-8">
        <EstimatorWizard />
      </section>
      <SiteFooter />
    </>
  );
}
