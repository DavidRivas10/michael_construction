import { NextResponse } from "next/server";
import { getEstimate } from "@/lib/estimator";
import { validateEstimateInput } from "@/lib/validate";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`estimate:${ip}`, { limit: 15, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again shortly." }, { status: 429 });
  }

  const body = await request.json();
  const { valid, errors } = validateEstimateInput(body);
  if (!valid) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const estimate = await getEstimate(body);
  return NextResponse.json(estimate);
}
