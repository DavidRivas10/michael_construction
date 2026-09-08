import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import LeadForm from "@/components/LeadForm";
import { IconPhone, IconMapPin } from "@/components/Icons";
import { getConfig } from "@/lib/db";

export const metadata = {
  title: "Contact",
  description: "Get in touch with Michael Construction for a free painting or home repair estimate.",
};

export default function ContactPage() {
  const config = getConfig();

  return (
    <>
      <SiteHeader config={config} />
      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 py-20 md:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">Contact</div>
          <h1 className="mb-4 font-display text-5xl font-black uppercase text-ink">Tell us about your project</h1>
          <p className="mb-8 text-lg text-ink-soft">
            Michael responds personally, almost always the same day, by phone, text, or email.
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
          <LeadForm ctaLabel="Send Message" showUrgencyCheckbox />
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
