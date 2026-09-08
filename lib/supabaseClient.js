// ---------------------------------------------------------------------------
// Cliente de Supabase — SOLO para uso del lado del servidor. Usa la
// "secret key" (equivalente a service_role), que tiene acceso completo y
// se salta Row Level Security — por eso NUNCA debe importarse desde un
// componente "use client" ni exponerse con el prefijo NEXT_PUBLIC_.
// Todo lib/db.js corre en el servidor (Server Components / API routes), así
// que esto es seguro tal como está.
// ---------------------------------------------------------------------------
import { createClient } from "@supabase/supabase-js";

let client = null;

export function getSupabase() {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error(
      "Faltan SUPABASE_URL y/o SUPABASE_SECRET_KEY en las variables de entorno — revisa .env.local."
    );
  }

  client = createClient(url, key, {
    auth: { persistSession: false },
  });
  return client;
}
