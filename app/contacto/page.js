import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LeadForm from "@/components/LeadForm";
import { IconPhone, IconMapPin } from "@/components/Icons";
import { getConfig } from "@/lib/db";

export default function ContactoPage() {
  const config = getConfig();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">Contacto</div>
          <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Cuéntanos del proyecto</h1>
          <p className="mb-8 text-lg text-ink-soft">
            Michael responde personalmente, casi siempre el mismo día, por teléfono, WhatsApp o correo.
          </p>
          <div className="flex flex-col gap-4 text-[15px] font-bold text-ink">
            <a href={`tel:${config.phone}`} className="flex items-center gap-3">
              <IconPhone className="h-5 w-5 text-gold-dark" /> {config.phone}
            </a>
            <div className="flex items-center gap-3">
              <IconMapPin className="h-5 w-5 text-gold-dark" /> {config.serviceArea}
            </div>
          </div>
        </div>
        <div className="border border-line bg-white p-8">
          <LeadForm ctaLabel="Enviar mensaje" />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
