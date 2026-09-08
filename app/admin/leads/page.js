import AdminShell from "@/components/AdminShell";
import LeadsTable from "@/components/LeadsTable";
import { requireSession } from "@/lib/auth";
import { listLeads } from "@/lib/db";

export default async function AdminLeadsPage() {
  requireSession();
  const leads = await listLeads();

  return (
    <AdminShell active="Leads" description="Cada solicitud del sitio público, en un solo lugar.">
      <LeadsTable leads={leads} />
    </AdminShell>
  );
}
