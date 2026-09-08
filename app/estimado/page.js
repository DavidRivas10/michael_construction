import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import EstimatorWizard from "@/components/EstimatorWizard";
import { getConfig } from "@/lib/db";

export default function EstimadoPage() {
  const config = getConfig();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-3xl px-6 pb-6 pt-16 text-center">
        <div className="eyebrow mb-3">Estimado gratis · Sin compromiso</div>
        <h1 className="mb-3 font-display text-4xl font-black uppercase text-ink md:text-5xl">
          Averigua tu precio antes de llamar a nadie
        </h1>
        <p className="mx-auto max-w-lg text-ink-soft">
          Responde unas preguntas rápidas y ve exactamente cómo se calcula tu rango de precio.
        </p>
      </section>

      <section className="px-6 pb-24 pt-8">
        <EstimatorWizard />
      </section>
      <SiteFooter />
    </>
  );
}
