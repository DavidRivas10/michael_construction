import AdminShell from "@/components/AdminShell";
import PricingAdmin from "@/components/PricingAdmin";
import { requireSession } from "@/lib/auth";
import { listPricing } from "@/lib/db";

export default async function AdminPricingPage() {
  requireSession();
  const pricing = await listPricing();

  return (
    <AdminShell active="Pricing" description="Los precios que usa el estimador público — editables sin tocar código.">
      <PricingAdmin pricing={pricing} />
    </AdminShell>
  );
}
