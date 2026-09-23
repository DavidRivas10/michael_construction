// ---------------------------------------------------------------------------
// Cliente de Supabase — SOLO para uso del lado del servidor. Usa la
// "secret key" (equivalente a service_role), que tiene acceso completo y
// se salta Row Level Security — por eso NUNCA debe importarse desde un
// componente "use client" ni exponerse con el prefijo NEXT_PUBLIC_.
// Todo lib/db.js corre en el servidor (Server Components / API routes), así
// que esto es seguro tal como está.
//
// IMPORTANTE -- por qué el fetch personalizado de abajo:
// `dynamic = "force-dynamic"` en app/layout.js evita que Next.js sirva HTML
// prerenderizado/cacheado para las paginas, pero eso NO desactiva por si
// solo el cache de fetch de Next.js/Vercel para cada llamada HTTP individual
// hecha DURANTE ese render. supabase-js hace sus peticiones con fetch() por
// debajo, y en Vercel esas llamadas pueden quedar cacheadas (Vercel Data
// Cache) aun dentro de una ruta "force-dynamic". Esto causo un bug real:
// /api/config (route handler) devolvia datos frescos, pero las paginas
// publicas (Server Components) seguian mostrando datos viejos indefinidamente
// despues de guardar cambios en el panel admin -- el fetch a Supabase desde
// el arbol de componentes habia quedado cacheado la primera vez que corrio.
// Pasarle `cache: "no-store"` explicitamente a cada fetch de Supabase saca
// esa llamada de cualquier cache (Next.js o Vercel), sin importar desde
// donde se invoque.
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
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
  return client;
}
