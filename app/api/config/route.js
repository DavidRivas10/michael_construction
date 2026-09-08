import { NextResponse } from "next/server";
import { getConfig, updateConfig } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ config: await getConfig() });
}

export async function PATCH(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const config = await updateConfig(body);
  return NextResponse.json({ config });
}
