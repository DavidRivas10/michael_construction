import { NextResponse } from "next/server";
import { addReview } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

// Endpoint PÚBLICO (sin sesión) para que un visitante deje su propia
// reseña desde /reviews. A propósito NO usa el mismo POST /api/reviews que
// usa el panel admin — ese requiere sesión de admin. Todo lo que entra por
// aquí queda como "pendiente" (isApproved: false) y solo aparece en el
// sitio después de que Michael lo aprueba desde /admin/testimonios.
export async function POST(request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`review-submit:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json();

  // Honeypot — igual que en el formulario de leads.
  if (body.website) {
    return NextResponse.json({ ok: true }); // fingimos éxito, no delatamos el honeypot
  }

  const author = String(body.author || "").trim();
  const neighborhood = String(body.neighborhood || "").trim();
  const text = String(body.text || "").trim();
  const rating = Number(body.rating);

  const errors = [];
  if (!author || author.length < 2) errors.push("Please enter your name.");
  if (author.length > 120) errors.push("Name is too long.");
  if (!text || text.length < 10) errors.push("Please write a few words about your experience.");
  if (text.length > 1000) errors.push("Review is too long.");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.push("Please choose a star rating.");

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const review = await addReview({ author, neighborhood, text, rating }, { isApproved: false });
  return NextResponse.json({ review }, { status: 201 });
}
