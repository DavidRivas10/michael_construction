import { NextResponse } from "next/server";
import { updateService } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(request, { params }) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const service = updateService(params.id, body);
  if (!service) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ service });
}
