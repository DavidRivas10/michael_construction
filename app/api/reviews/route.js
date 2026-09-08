import { NextResponse } from "next/server";
import { listReviews, addReview } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ reviews: await listReviews() });
}

export async function POST(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const review = await addReview(body);
  return NextResponse.json({ review }, { status: 201 });
}
