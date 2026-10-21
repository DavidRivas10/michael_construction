import { NextResponse } from "next/server";
import { deleteReview, updateReview } from "@/lib/db";
import { getSession } from "@/lib/auth";

// Aprobar (o revertir la aprobación de) una reseña enviada por un visitante.
// Usado por el botón "Aprobar" en /admin/testimonios.
export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const review = await updateReview(id, body);
  if (!review) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
