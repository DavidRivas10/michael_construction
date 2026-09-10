import { NextResponse } from "next/server";
import { listPortfolio, addPortfolioItem, uploadPortfolioPhoto } from "@/lib/db";
import { getSession } from "@/lib/auth";

const MAX_PHOTO_BYTES = 8 * 1024 * 1024; // 8MB per photo

export async function GET() {
  return NextResponse.json({ items: await listPortfolio() });
}

// Accepts multipart/form-data: title, category, location, beforeFile, afterFile
// (both files optional — an item can be added with just text and photos added
// later, though the before/after slider looks best with both).
export async function POST(request) {
  if (!getSession()) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const form = await request.formData();
  const title = String(form.get("title") || "").trim();
  const category = String(form.get("category") || "interior");
  const location = String(form.get("location") || "").trim();
  const beforeFile = form.get("beforeFile");
  const afterFile = form.get("afterFile");

  if (!title) return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });

  for (const f of [beforeFile, afterFile]) {
    if (f && typeof f === "object" && f.size > 0) {
      if (!String(f.type || "").startsWith("image/")) {
        return NextResponse.json({ error: "Los archivos deben ser imágenes." }, { status: 400 });
      }
      if (f.size > MAX_PHOTO_BYTES) {
        return NextResponse.json({ error: "Cada foto debe pesar menos de 8MB." }, { status: 400 });
      }
    }
  }

  try {
    const [beforeUrl, afterUrl] = await Promise.all([
      beforeFile && beforeFile.size > 0 ? uploadPortfolioPhoto(beforeFile, "before") : null,
      afterFile && afterFile.size > 0 ? uploadPortfolioPhoto(afterFile, "after") : null,
    ]);

    const item = await addPortfolioItem({ title, category, location, beforeUrl, afterUrl });
    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    // Most likely cause: the "portfolio-photos" Storage bucket doesn't exist
    // yet in Supabase. Surface a clear message instead of a generic 500.
    const message = /bucket/i.test(err.message)
      ? "No se pudo subir la foto: falta crear el bucket 'portfolio-photos' en Supabase Storage (Storage → New bucket → público)."
      : "No se pudo guardar el proyecto. Intenta de nuevo.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}