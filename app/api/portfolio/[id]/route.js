import { NextResponse } from "next/server";
import { deletePortfolioItem } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_request, { params }) {
  const { id } = await params;
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  await deletePortfolioItem(id);
  return NextResponse.json({ ok: true });
}
