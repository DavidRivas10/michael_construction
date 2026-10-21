import AdminShell from "@/components/AdminShell";
import TestimonialsAdmin from "@/components/TestimonialsAdmin";
import { requireSession } from "@/lib/auth";
import { listReviews } from "@/lib/db";

export default async function AdminTestimoniosPage() {
  await requireSession();
  const reviews = await listReviews({ onlyApproved: false });

  return (
    <AdminShell active="Testimonios" description="Estos son los que se muestran en el inicio y en /reviews.">
      <TestimonialsAdmin reviews={reviews} />
    </AdminShell>
  );
}
