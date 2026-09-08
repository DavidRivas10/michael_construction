import Link from "next/link";
import { getConfig } from "@/lib/db";

export default function SiteFooter() {
  const config = getConfig();

  return (
    <footer className="bg-charcoal py-16 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-3">
        <div>
          <div className="font-display text-xl font-bold uppercase tracking-wide">{config.businessName}</div>
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Interior and exterior painting, plus home repairs, in {config.serviceArea}.
          </p>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Services</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/services">Interior painting</Link></li>
            <li><Link href="/services">Exterior painting</Link></li>
            <li><Link href="/services">Home repairs</Link></li>
            <li><Link href="/estimate">AI estimate</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Contact</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li>{config.phone}</li>
            <li>{config.email}</li>
            <li>{config.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-6 pt-6 text-xs text-white/45">
        © {new Date().getFullYear()} {config.businessName}. Licensed &amp; insured in {config.licenseState}.
      </div>
    </footer>
  );
}
