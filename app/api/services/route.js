import { NextResponse } from "next/server";
import { listServices } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ services: listServices() });
}
