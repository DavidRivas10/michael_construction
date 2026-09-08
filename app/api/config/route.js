import { NextResponse } from "next/server";
import { getConfig, updateConfig } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ config: getConfig() });
}

export async function PATCH(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const config = updateConfig(body);
  return NextResponse.json({ config });
}
