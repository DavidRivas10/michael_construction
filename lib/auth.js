// ---------------------------------------------------------------------------
// Autenticación del panel admin — simple y de un solo usuario (Michael).
// MODO DEMO: la contraseña vive en .env.local como ADMIN_PASSWORD
// (por defecto "demo1234" si no se define nada). Cuando haya más de un
// usuario, esto se reemplaza por NextAuth o Supabase Auth sin tocar las
// páginas que ya llaman a `isAuthenticated()`.
// ---------------------------------------------------------------------------
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "mc_admin_session";
const SECRET = process.env.SESSION_SECRET || "demo-secret-change-me";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "demo1234";
}

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function checkPassword(password) {
  return password === getAdminPassword();
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidToken(token) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  return sign(payload) === signature;
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
