import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`login:${ip}`, { limit: 8, windowMs: 5 * 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }

  const { password } = await request.json();

  if (!checkPassword(password)) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
