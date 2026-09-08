import { NextResponse } from "next/server";
import { getEstimate } from "@/lib/estimator";

export async function POST(request) {
  const body = await request.json();
  const estimate = await getEstimate(body);
  return NextResponse.json(estimate);
}
