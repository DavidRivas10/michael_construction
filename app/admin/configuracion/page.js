import AdminShell from "@/components/AdminShell";
import ConfigForm from "@/components/ConfigForm";
import { requireSession } from "@/lib/auth";
import { getConfig } from "@/lib/db";

export default function AdminConfigPage() {
  requireSession();
  const config = getConfig();

  return (
    <AdminShell active="Configuración" description="El título del inicio y tus datos de contacto — se reflejan en el sitio al instante.">
      <ConfigForm config={config} />
    </AdminShell>
  );
}
