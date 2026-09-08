// ---------------------------------------------------------------------------
// Capa de datos MOCK para demo/desarrollo.
// Guarda todo en archivos JSON dentro de /data. Cuando haya credenciales
// reales de Postgres (Supabase/Neon), esta es la ÚNICA capa que hay que
// reemplazar — el resto de la app (páginas, rutas API) no cambia, porque
// todas llaman a estas mismas funciones.
// ---------------------------------------------------------------------------
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON(file) {
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

function writeJSON(file, data) {
  const p = path.join(DATA_DIR, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

// ---- Config / contenido del sitio ----
export function getConfig() {
  return readJSON("config.json");
}

export function updateConfig(partial) {
  const current = getConfig();
  const updated = { ...current, ...partial };
  writeJSON("config.json", updated);
  return updated;
}

// ---- Servicios ----
export function listServices() {
  return readJSON("services.json") || [];
}

export function updateService(id, partial) {
  const services = listServices();
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  services[idx] = { ...services[idx], ...partial };
  writeJSON("services.json", services);
  return services[idx];
}

// ---- Preguntas frecuentes ----
export function listFaq() {
  return readJSON("faq.json") || [];
}

export function addFaqItem(item) {
  const items = listFaq();
  const newItem = { id: `f${Date.now()}`, ...item };
  items.push(newItem);
  writeJSON("faq.json", items);
  return newItem;
}

export function updateFaqItem(id, partial) {
  const items = listFaq();
  const idx = items.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...partial };
  writeJSON("faq.json", items);
  return items[idx];
}

export function deleteFaqItem(id) {
  const items = listFaq().filter((f) => f.id !== id);
  writeJSON("faq.json", items);
}

// ---- Portafolio ----
export function listPortfolio() {
  return readJSON("portfolio.json") || [];
}

export function addPortfolioItem(item) {
  const items = listPortfolio();
  const newItem = { id: `p${Date.now()}`, isExample: false, ...item };
  items.unshift(newItem);
  writeJSON("portfolio.json", items);
  return newItem;
}

export function deletePortfolioItem(id) {
  const items = listPortfolio().filter((p) => p.id !== id);
  writeJSON("portfolio.json", items);
}

// ---- Reseñas ----
export function listReviews() {
  return readJSON("reviews.json") || [];
}

export function addReview(review) {
  const reviews = listReviews();
  const newReview = { id: `r${Date.now()}`, isExample: false, ...review };
  reviews.unshift(newReview);
  writeJSON("reviews.json", reviews);
  return newReview;
}

export function deleteReview(id) {
  const reviews = listReviews().filter((r) => r.id !== id);
  writeJSON("reviews.json", reviews);
}

// ---- Leads ----
export function listLeads() {
  const leads = readJSON("leads.json") || [];
  return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getLead(id) {
  return listLeads().find((l) => l.id === id) || null;
}

export function createLead(data) {
  const leads = readJSON("leads.json") || [];
  const lead = {
    id: `L-${Date.now()}`,
    nombre: data.nombre || "",
    telefono: data.telefono || "",
    email: data.email || "",
    canalOrigen: data.canalOrigen || "formulario", // formulario | estimador | chatbot
    tipoTrabajo: data.tipoTrabajo || "",
    mensaje: data.mensaje || "",
    estimadoMin: data.estimadoMin ?? null,
    estimadoMax: data.estimadoMax ?? null,
    urgente: !!data.urgente,
    estado: "nuevo", // nuevo | contactado | agendado | cerrado
    notasInternas: "",
    createdAt: new Date().toISOString(),
  };
  leads.push(lead);
  writeJSON("leads.json", leads);
  return lead;
}

export function updateLead(id, partial) {
  const leads = readJSON("leads.json") || [];
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...partial };
  writeJSON("leads.json", leads);
  return leads[idx];
}
