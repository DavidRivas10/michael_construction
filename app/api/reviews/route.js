import { NextResponse } from "next/server";
import { listReviews, addReview } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  return NextResponse.json({ reviews: await listReviews() });
}

// Usado solo desde /admin/testimonios — un testimonio que el propio Michael
// agrega queda aprobado y visible de inmediato.
export async function POST(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await request.json();
  const review = await addReview(body, { isApproved: true });
  return NextResponse.json({ review }, { status: 201 });
}
