import { NextResponse } from "next/server";
import { updateFaqItem, deleteFaqItem } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const item = await updateFaqItem(params.id, body);
  if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await deleteFaqItem(params.id);
  return NextResponse.json({ ok: true });
}
