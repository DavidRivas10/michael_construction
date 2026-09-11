import Link from "next/link";
import { getConfig } from "@/lib/db";

export default async function SiteFooter() {
  const config = await getConfig();

  return (
    <footer className="border-t-2 border-gold bg-charcoal py-16 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mb-3 text-xs font-bold uppercase tracking-wide text-gold">Working hours</div>
          <ul className="space-y-2 text-sm text-white/75">
            <li>Mon – Sat: 7am – 6pm</li>
            <li>Sunday: Closed</li>
            <li>Emergency calls: 24/7</li>
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
        © {new Date().getFullYear()} {config.businessName}. All rights reserved.
      </div>
    </footer>
  );
}
