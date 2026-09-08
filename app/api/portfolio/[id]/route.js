import { NextResponse } from "next/server";
import { deletePortfolioItem } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  deletePortfolioItem(params.id);
  return NextResponse.json({ ok: true });
}
