import AdminShell from "@/components/AdminShell";
import PortfolioAdmin from "@/components/PortfolioAdmin";
import { requireSession } from "@/lib/auth";
import { listPortfolio } from "@/lib/db";

export default async function AdminPortafolioPage() {
  requireSession();
  const items = await listPortfolio();

  return (
    <AdminShell active="Portafolio" description="Lo que sube aquí es lo que ve el visitante en el sitio.">
      <PortfolioAdmin items={items} />
    </AdminShell>
  );
}
