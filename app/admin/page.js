import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import EstadoPill from "@/components/EstadoPill";
import { requireSession } from "@/lib/auth";
import { listLeads } from "@/lib/db";

export default async function AdminDashboard() {
  requireSession();
  const leads = await listLeads();

  const nuevos = leads.filter((l) => l.estado === "nuevo").length;
  const pendientes = leads.filter((l) => ["nuevo", "contactado"].includes(l.estado)).length;
  const unaSemanaAtras = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const estaSemana = leads.filter((l) => new Date(l.createdAt).getTime() > unaSemanaAtras).length;

  return (
    <AdminShell active="Dashboard" description="Lo más importante de tu negocio, de un vistazo.">
      <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Leads nuevos" value={nuevos} accent />
        <StatCard label="Pendientes de respuesta" value={pendientes} />
        <StatCard label="Esta semana" value={estaSemana} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold uppercase text-ink">Últimos leads</h2>
        <Link href="/admin/leads" className="text-sm font-bold text-gold-dark">Ver todos →</Link>
      </div>

      <div className="border border-line bg-white">
        {leads.length === 0 && (
          <div className="p-8 text-center text-sm text-ink-faint">
            Aún no hay leads. Prueba el formulario de contacto o el estimador en el sitio público.
          </div>
        )}
        {leads.slice(0, 6).map((l) => (
          <Link
            key={l.id}
            href={`/admin/leads/${l.id}`}
            className="flex items-center justify-between border-b border-line px-6 py-4 last:border-b-0 hover:bg-paper-2/50"
          >
            <div>
              <div className="font-bold text-ink">{l.nombre}</div>
              <div className="text-xs text-ink-faint">{l.telefono} · {l.canalOrigen}</div>
            </div>
            <EstadoPill estado={l.estado} />
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div className="border border-line bg-white p-6">
      <div className="text-xs font-bold uppercase tracking-wide text-ink-faint">{label}</div>
      <div className={`mt-2 font-display text-4xl font-bold ${accent ? "text-gold-dark" : "text-ink"}`}>{value}</div>
    </div>
  );
}
