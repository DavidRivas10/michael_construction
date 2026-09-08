import AdminShell from "@/components/AdminShell";
import ServicesAdmin from "@/components/ServicesAdmin";
import { requireSession } from "@/lib/auth";
import { listServices } from "@/lib/db";

export default function AdminServiciosPage() {
  requireSession();
  const services = listServices();

  return (
    <AdminShell active="Servicios" description="Los tres servicios que se muestran en el inicio y en /servicios.">
      <ServicesAdmin services={services} />
    </AdminShell>
  );
}
