import { NextResponse } from "next/server";
import { listFaq, addFaqItem } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ items: await listFaq() });
}

export async function POST(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const item = await addFaqItem(body);
  return NextResponse.json({ item }, { status: 201 });
}
