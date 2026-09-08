import AdminShell from "@/components/AdminShell";
import FaqAdmin from "@/components/FaqAdmin";
import { requireSession } from "@/lib/auth";
import { listFaq } from "@/lib/db";

export default async function AdminPreguntasPage() {
  requireSession();
  const items = await listFaq();

  return (
    <AdminShell active="Preguntas frecuentes" description="Se muestran en el acordeón del inicio.">
      <FaqAdmin items={items} />
    </AdminShell>
  );
}
