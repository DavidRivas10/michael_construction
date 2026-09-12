import Link from "next/link";
import { getConfig } from "@/lib/db";
import { LogoMark } from "./LogoMark";
import { IconPhone, IconMapPin } from "./Icons";

export default async function SiteFooter() {
  const config = await getConfig();

  return (
    <footer className="relative overflow-hidden border-t-2 border-gold bg-navy-dark py-16 text-white">
      {/* Textura sutil de líneas diagonales — un detalle de profundidad muy
          discreto, no un patrón que compita con el contenido. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0px, #fff 1px, transparent 1px, transparent 34px)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <LogoMark variant="light" tagline />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Interior and exterior painting, plus home repairs, in {config.serviceArea}. One crew, start to finish.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Services</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/services" className="transition hover:text-white">Interior painting</Link></li>
            <li><Link href="/services" className="transition hover:text-white">Exterior painting</Link></li>
            <li><Link href="/services" className="transition hover:text-white">Home repairs</Link></li>
            <li><Link href="/estimate" className="transition hover:text-white">AI estimate</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Working hours</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li>Mon – Sat: 7am – 6pm</li>
            <li>Sunday: Closed</li>
            <li>Emergency calls: 24/7</li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Contact</div>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li className="flex items-center gap-2"><IconPhone className="h-3.5 w-3.5 text-white/40" />{config.phone}</li>
            <li>{config.email}</li>
            <li className="flex items-center gap-2"><IconMapPin className="h-3.5 w-3.5 text-white/40" />{config.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="relative mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 px-6 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {config.businessName}. All rights reserved.</span>
        {config.licenseState && !config.licenseState.startsWith("[") && (
          <span>Licensed in {config.licenseState} &middot; Fully insured</span>
        )}
      </div>
    </footer>
  );
}
