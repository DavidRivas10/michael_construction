import { NextResponse } from "next/server";
import { listServices } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ services: await listServices() });
}
