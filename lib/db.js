// ---------------------------------------------------------------------------
// Capa de datos — Supabase/Postgres real.
//
// Todas las funciones son ahora ASÍNCRONAS (devuelven una Promise) porque
// leen de una base de datos en la nube, no de un archivo local. Cualquier
// componente o ruta que las use necesita `await`. Esta es la ÚNICA
// diferencia real frente a la versión anterior basada en JSON — los NOMBRES
// de las funciones y lo que devuelven no cambiaron.
//
// Ver supabase/schema.sql para crear las tablas la primera vez, y el README
// para las variables de entorno necesarias (SUPABASE_URL, SUPABASE_SECRET_KEY).
// ---------------------------------------------------------------------------
import { getSupabase } from "./supabaseClient";

function must(error, context) {
  if (error) throw new Error(`[db] ${context}: ${error.message}`);
}

// ---- Config / contenido del sitio ----
export async function getConfig() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("config").select("data").eq("id", 1).single();
  must(error, "getConfig");
  return data.data;
}

export async function updateConfig(partial) {
  const current = await getConfig();
  const updated = { ...current, ...partial };
  const supabase = getSupabase();
  const { error } = await supabase.from("config").update({ data: updated }).eq("id", 1);
  must(error, "updateConfig");
  return updated;
}

// ---- Servicios ----
export async function listServices() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("services").select("*").order("sort_order");
  must(error, "listServices");
  return data.map(rowToService);
}

export async function updateService(id, partial) {
  const supabase = getSupabase();
  const patch = {};
  if (partial.title !== undefined) patch.title = partial.title;
  if (partial.shortDesc !== undefined) patch.short_desc = partial.shortDesc;
  if (partial.items !== undefined) patch.items = partial.items;
  const { data, error } = await supabase.from("services").update(patch).eq("id", id).select().single();
  if (error) return null;
  return rowToService(data);
}

function rowToService(row) {
  return { id: row.id, title: row.title, shortDesc: row.short_desc, items: row.items || [] };
}

// ---- Preguntas frecuentes ----
export async function listFaq() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("faq").select("*").order("sort_order");
  must(error, "listFaq");
  return data;
}

export async function addFaqItem(item) {
  const supabase = getSupabase();
  const newItem = { id: `f${Date.now()}`, question: item.question, answer: item.answer, sort_order: 999 };
  const { data, error } = await supabase.from("faq").insert(newItem).select().single();
  must(error, "addFaqItem");
  return data;
}

export async function updateFaqItem(id, partial) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("faq").update(partial).eq("id", id).select().single();
  if (error) return null;
  return data;
}

export async function deleteFaqItem(id) {
  const supabase = getSupabase();
  await supabase.from("faq").delete().eq("id", id);
}

// ---- Portafolio ----
export async function listPortfolio() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("portfolio").select("*").order("created_at", { ascending: false });
  must(error, "listPortfolio");
  return data.map(rowToPortfolio);
}

export async function addPortfolioItem(item) {
  const supabase = getSupabase();
  const newItem = {
    id: `p${Date.now()}`,
    title: item.title,
    category: item.category,
    location: item.location,
    before_url: item.beforeUrl || null,
    after_url: item.afterUrl || null,
    featured: false,
    is_example: false,
  };
  const { data, error } = await supabase.from("portfolio").insert(newItem).select().single();
  must(error, "addPortfolioItem");
  return rowToPortfolio(data);
}

// Bucket público de Supabase Storage donde viven las fotos reales del
// portafolio. Debe crearse una vez desde el dashboard de Supabase
// (Storage → New bucket → nombre "portfolio-photos" → Public bucket: ON).
// La subida usa la service-role key (getSupabase()), así que no depende de
// políticas de Storage — solo el bucket necesita ser público para que
// getPublicUrl() sirva URLs que cualquier visitante pueda cargar.
const PORTFOLIO_BUCKET = "portfolio-photos";

export async function uploadPortfolioPhoto(file, prefix) {
  const supabase = getSupabase();
  const ext = (file.name?.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const arrayBuffer = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from(PORTFOLIO_BUCKET)
    .upload(path, arrayBuffer, { contentType: file.type || "image/jpeg", upsert: false });
  must(error, "uploadPortfolioPhoto");
  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deletePortfolioItem(id) {
  const supabase = getSupabase();
  await supabase.from("portfolio").delete().eq("id", id);
}

function rowToPortfolio(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    beforeUrl: row.before_url || null,
    afterUrl: row.after_url || null,
    featured: row.featured,
    isExample: row.is_example,
  };
}

// ---- Reseñas ----
export async function listReviews() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  must(error, "listReviews");
  return data.map(rowToReview);
}

export async function addReview(review) {
  const supabase = getSupabase();
  const newReview = {
    id: `r${Date.now()}`,
    author: review.author,
    rating: review.rating,
    text: review.text,
    neighborhood: review.neighborhood,
    is_example: false,
  };
  const { data, error } = await supabase.from("reviews").insert(newReview).select().single();
  must(error, "addReview");
  return rowToReview(data);
}

export async function deleteReview(id) {
  const supabase = getSupabase();
  await supabase.from("reviews").delete().eq("id", id);
}

function rowToReview(row) {
  return {
    id: row.id,
    author: row.author,
    rating: row.rating,
    text: row.text,
    neighborhood: row.neighborhood,
    isExample: row.is_example,
  };
}

// ---- Pricing (motor de reglas del estimador) ----
export async function listPricing() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("pricing").select("data");
  must(error, "listPricing");
  return data.map((row) => row.data);
}

export async function getPricingForService(serviceId) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("pricing").select("data").eq("service_id", serviceId).single();
  if (error) return null;
  return data.data;
}

export async function updatePricingForService(serviceId, partial) {
  const current = await getPricingForService(serviceId);
  if (!current) return null;
  const updated = { ...current, ...partial };
  const supabase = getSupabase();
  const { error } = await supabase.from("pricing").update({ data: updated }).eq("service_id", serviceId);
  must(error, "updatePricingForService");
  return updated;
}

// ---- Leads ----
export async function listLeads() {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  must(error, "listLeads");
  return data.map(rowToLead);
}

export async function getLead(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from("leads").select("*").eq("id", id).single();
  if (error) return null;
  return rowToLead(data);
}

export async function createLead(data) {
  const supabase = getSupabase();
  const lead = {
    id: `L-${Date.now()}`,
    nombre: data.nombre || "",
    telefono: data.telefono || "",
    email: data.email || "",
    canal_origen: data.canalOrigen || "formulario",
    tipo_trabajo: data.tipoTrabajo || "",
    mensaje: data.mensaje || "",
    estimado_min: data.estimadoMin ?? null,
    estimado_max: data.estimadoMax ?? null,
    urgente: !!data.urgente,
    has_urgent_word: !!data.hasUrgentWord,
    estado: "nuevo",
    notas_internas: "",
    notified: null,
  };
  const { data: row, error } = await supabase.from("leads").insert(lead).select().single();
  must(error, "createLead");
  return rowToLead(row);
}

export async function updateLead(id, partial) {
  const supabase = getSupabase();
  const patch = {};
  if (partial.estado !== undefined) patch.estado = partial.estado;
  if (partial.notasInternas !== undefined) patch.notas_internas = partial.notasInternas;
  if (partial.notified !== undefined) patch.notified = partial.notified;
  const { data, error } = await supabase.from("leads").update(patch).eq("id", id).select().single();
  if (error) return null;
  return rowToLead(data);
}

function rowToLead(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    telefono: row.telefono,
    email: row.email,
    canalOrigen: row.canal_origen,
    tipoTrabajo: row.tipo_trabajo,
    mensaje: row.mensaje,
    estimadoMin: row.estimado_min,
    estimadoMax: row.estimado_max,
    urgente: row.urgente,
    hasUrgentWord: row.has_urgent_word,
    estado: row.estado,
    notasInternas: row.notas_internas || "",
    notified: row.notified,
    createdAt: row.created_at,
  };
}