import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import PortfolioGrid from "@/components/PortfolioGrid";
import { getConfig, listPortfolio } from "@/lib/db";

export default function PortafolioPage() {
  const config = getConfig();
  const items = listPortfolio();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow mb-3">Portafolio</div>
        <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Trabajos reales, resultados reales</h1>
        <p className="mx-auto max-w-xl text-lg text-ink-soft">
          Michael sube estas fotos directamente desde el panel de administración — sin depender de un desarrollador.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <PortfolioGrid items={items} />
      </section>
      <SiteFooter />
    </>
  );
}
