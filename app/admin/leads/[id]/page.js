import Link from "next/link";
import AdminShell from "@/components/AdminShell";
import LeadDetailPanel from "@/components/LeadDetailPanel";
import { requireSession } from "@/lib/auth";
import { getLead } from "@/lib/db";

export default function LeadDetailPage({ params }) {
  requireSession();
  const lead = getLead(params.id);

  return (
    <AdminShell active="Leads" description={lead ? `Solicitud de ${lead.nombre}` : "Lead no encontrado"}>
      <Link href="/admin/leads" className="mb-5 inline-block text-sm font-bold text-ink-faint hover:text-ink">
        ← Todos los leads
      </Link>
      {lead ? (
        <LeadDetailPanel lead={lead} />
      ) : (
        <div className="border border-line bg-white p-8 text-center text-ink-faint">Lead no encontrado.</div>
      )}
    </AdminShell>
  );
}
