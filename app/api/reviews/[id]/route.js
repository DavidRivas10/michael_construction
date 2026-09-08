import { NextResponse } from "next/server";
import { deleteReview } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await deleteReview(params.id);
  return NextResponse.json({ ok: true });
}
