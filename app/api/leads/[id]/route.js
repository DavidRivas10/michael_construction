import { NextResponse } from "next/server";
import { getLead, updateLead } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_request, { params }) {
  const { id } = await params;
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const lead = await getLead(id);
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  if (!(await getSession())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const lead = await updateLead(id, body);
  if (!lead) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ lead });
}
