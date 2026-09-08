// ---------------------------------------------------------------------------
// Admin panel authentication — single user (Michael), reinforced for
// production. In development, missing env vars fall back to safe demo
// values so `npm run dev` keeps working out of the box. In production
// (NODE_ENV=production) missing ADMIN_PASSWORD / SESSION_SECRET now throw
// at request time instead of silently running with demo credentials —
// that silent fallback was the single most dangerous gap in the v2 build.
// ---------------------------------------------------------------------------
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "mc_admin_session";
const IS_PROD = process.env.NODE_ENV === "production";

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret) return secret;
  if (IS_PROD) {
    throw new Error(
      "SESSION_SECRET no está configurado. No se puede iniciar el panel admin en producción sin él."
    );
  }
  return "demo-secret-change-me";
}

function getAdminPassword() {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw) return pw;
  if (IS_PROD) {
    throw new Error(
      "ADMIN_PASSWORD no está configurado. No se puede iniciar el panel admin en producción sin él."
    );
  }
  return "demo1234";
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

// Comparación a tiempo constante — evita timing attacks sobre la contraseña.
function timingSafeStringEqual(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Igual comparamos contra sí mismo para no filtrar la longitud por timing.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export function checkPassword(password) {
  if (!password) return false;
  return timingSafeStringEqual(password, getAdminPassword());
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidToken(token) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  return timingSafeStringEqual(sign(payload), signature);
}

export function getSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return isValidToken(token);
}

// Usar en el TOPE de cualquier página de /admin/* (menos /admin/login) para
// redirigir automáticamente si no hay sesión válida.
export function requireSession() {
  if (!getSession()) {
    redirect("/admin/login");
  }
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
