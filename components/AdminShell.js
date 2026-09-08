import Link from "next/link";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "grid" },
  { href: "/admin/leads", label: "Leads", icon: "inbox" },
  { href: "/admin/portafolio", label: "Portafolio", icon: "image" },
  { href: "/admin/contenido", label: "Servicios", icon: "layers" },
  { href: "/admin/testimonios", label: "Testimonios", icon: "star" },
  { href: "/admin/preguntas", label: "Preguntas frecuentes", icon: "help" },
  { href: "/admin/configuracion", label: "Configuración", icon: "gear" },
];

const ICONS = {
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="1" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  layers: <><path d="m12 2 9 5-9 5-9-5z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  star: <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" /><path d="M12 17h.01" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" /></>,
};

function NavIcon({ name }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

export default function AdminShell({ active, title, description, actions, children }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-charcoal text-white sm:flex">
        <div className="flex items-center gap-2.5 border-b border-white/10 px-6 py-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B8862E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" /><path d="M6 21V9l6-5 6 5v12" /><path d="M10 21v-6h4v6" />
          </svg>
          <div className="font-display text-base font-bold uppercase leading-none">Michael Construction</div>
        </div>
        <nav className="flex-1 px-3 py-5">
          {NAV.map((n) => {
            const isActive = n.label === active;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`mb-1 flex items-center gap-3 rounded-[3px] px-3 py-2.5 text-[13.5px] font-semibold transition ${
                  isActive ? "bg-white/10 text-white" : "text-white/55 hover:bg-white/5 hover:text-white/85"
                }`}
              >
                <NavIcon name={n.icon} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-6 py-4">
          <LogoutButton />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-6 py-5 sm:px-9">
          <div>
            <h1 className="font-display text-2xl font-bold uppercase text-ink">{active}</h1>
            {description && <p className="mt-0.5 text-sm text-ink-faint">{description}</p>}
          </div>
          {actions}
        </div>
        <div className="px-6 py-8 sm:px-9">{children}</div>
      </div>
    </div>
  );
}
