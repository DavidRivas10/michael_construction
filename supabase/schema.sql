-- ---------------------------------------------------------------------------
-- Maykar Professional Painting LLC — esquema de base de datos real (Supabase/Postgres)
--
-- CÓMO USAR ESTE ARCHIVO:
-- 1. Entra a tu proyecto en supabase.com
-- 2. Menú lateral izquierdo -> "SQL Editor"
-- 3. Pega TODO el contenido de este archivo
-- 4. Dale click a "Run"
-- Esto crea todas las tablas necesarias, vacías. Los datos de ejemplo
-- (servicios, precios, preguntas frecuentes) se insertan al final para que
-- el sitio no se vea vacío hasta que Michael suba su contenido real.
--
-- Seguridad: se activa Row Level Security (RLS) en todas las tablas SIN
-- políticas — eso significa que la "anon/publishable key" (la que es segura
-- de exponer en el navegador) NO puede leer ni escribir nada aquí por
-- defecto. Solo el código del servidor, usando la "secret key", puede
-- acceder — esa clave nunca llega al navegador del visitante.
-- ---------------------------------------------------------------------------

create table if not exists config (
  id int primary key default 1,
  data jsonb not null,
  constraint single_row check (id = 1)
);
alter table config enable row level security;

create table if not exists services (
  id text primary key,
  title text not null,
  short_desc text,
  items jsonb default '[]'::jsonb,
  sort_order int default 0
);
alter table services enable row level security;

create table if not exists faq (
  id text primary key,
  question text not null,
  answer text not null,
  sort_order int default 0
);
alter table faq enable row level security;

create table if not exists portfolio (
  id text primary key,
  title text,
  category text,
  location text,
  description text,
  before_url text,
  after_url text,
  featured boolean default false,
  is_example boolean default false,
  created_at timestamptz default now()
);
alter table portfolio enable row level security;

create table if not exists reviews (
  id text primary key,
  author text,
  rating int,
  text text,
  neighborhood text,
  is_example boolean default false,
  is_approved boolean default true,
  created_at timestamptz default now()
);
alter table reviews enable row level security;

create table if not exists pricing (
  service_id text primary key,
  data jsonb not null
);
alter table pricing enable row level security;

create table if not exists leads (
  id text primary key,
  nombre text,
  telefono text,
  email text,
  canal_origen text,
  tipo_trabajo text,
  mensaje text,
  estimado_min int,
  estimado_max int,
  urgente boolean default false,
  has_urgent_word boolean default false,
  estado text default 'nuevo',
  notas_internas text default '',
  notified jsonb,
  created_at timestamptz default now()
);
alter table leads enable row level security;

-- --- Datos de ejemplo (los mismos que ya tenías en modo demo) ---

insert into config (id, data) values (1, '{
  "businessName": "Maykar Professional Painting LLC",
  "heroHeadline": "The work your neighbors already recommend.",
  "heroSubheadline": "A family-owned, licensed and insured painting and repair company. Clear pricing, clean work, and results that last.",
  "phone": "(434) 760-9139",
  "smsPhone": "+14347609139",
  "email": "maykapainting@gmail.com",
  "serviceArea": "Charlottesville, VA and surrounding areas",
  "licenseState": "[State]",
  "yearsInBusiness": 15,
  "notifyEmail": "maykapainting@gmail.com",
  "isExampleData": true
}'::jsonb) on conflict (id) do nothing;

insert into services (id, title, short_desc, items, sort_order) values
  ('interior', 'Interior Painting', 'Walls, ceilings, trim and cabinets, with careful prep and even, lasting finishes.', '["Walls & ceilings","Trim & doors","Kitchen cabinets","Drywall repair before painting"]'::jsonb, 1),
  ('exterior', 'Exterior Painting', 'Weather-resistant products so your home''s exterior holds up through the seasons.', '["Siding & facades","Decks & fences","Exterior trim","Pressure washing before painting"]'::jsonb, 2),
  ('reparacion', 'Home Repairs', 'The fixes most contractors skip — handled by the same crew that paints your home.', '["Drywall & leaks","General carpentry","Deck repair","Damaged trim & doors"]'::jsonb, 3)
on conflict (id) do nothing;

insert into faq (id, question, answer, sort_order) values
  ('f1', 'Is the estimate really free?', 'Yes. The range you see from the AI estimator has no cost and no obligation, and the visit to confirm the exact price is free too.', 1),
  ('f2', 'What is the price based on?', 'The type of project, the approximate size, and the current condition you tell us about, compared against the real cost of similar jobs. Michael always confirms the final number in person before work starts.', 2),
  ('f3', 'How fast do you respond?', 'Michael personally reviews every request and almost always responds the same day, by phone, text, or email.', 3),
  ('f4', 'Are you licensed and insured?', 'Yes, we carry active license and insurance — happy to share documentation if your insurer or HOA needs it.', 4)
on conflict (id) do nothing;

insert into portfolio (id, title, category, location, featured, is_example) values
  ('p1', 'Kitchen Refresh (SAMPLE)', 'interior', '[Your City], VA', true, true),
  ('p2', 'Full Exterior Repaint (SAMPLE)', 'exterior', '[Your City], VA', true, true),
  ('p3', 'Deck & Fence Repair (SAMPLE)', 'reparacion', '[Your City], VA', false, true)
on conflict (id) do nothing;

insert into reviews (id, author, rating, text, neighborhood, is_example) values
  ('r1', 'Customer (SAMPLE)', 5, 'Sample review — replace with a real Google review before launch.', '[Neighborhood]', true),
  ('r2', 'Customer (SAMPLE)', 5, 'Sample review — replace with a real Google review before launch.', '[Neighborhood]', true),
  ('r3', 'Customer (SAMPLE)', 5, 'Sample review — replace with a real Google review before launch.', '[Neighborhood]', true)
on conflict (id) do nothing;

insert into pricing (service_id, data) values
  ('interior', '{
    "serviceId": "interior", "label": "Interior Painting", "pricingModel": "tiered", "allowAutoEstimate": true, "minimumPrice": 350,
    "tiers": {
      "small": {"label": "Small (1 room / touch-up area)", "min": 600, "max": 950},
      "medium": {"label": "Medium (several rooms / partial home)", "min": 1200, "max": 1800},
      "large": {"label": "Large (whole house)", "min": 2200, "max": 3400}
    },
    "conditionMultipliers": {"good": 0.94, "fair": 1.0, "poor": 1.22},
    "addOns": [
      {"id": "ceilings", "label": "Ceilings included", "price": 180},
      {"id": "trim", "label": "Trim & doors", "price": 150},
      {"id": "cabinets", "label": "Cabinet painting", "price": 420}
    ],
    "disclaimer": "This is an initial estimate based on the information provided. Final pricing may change after an on-site assessment."
  }'::jsonb),
  ('exterior', '{
    "serviceId": "exterior", "label": "Exterior Painting", "pricingModel": "tiered", "allowAutoEstimate": true, "minimumPrice": 900,
    "tiers": {
      "small": {"label": "Small (single-story, partial)", "min": 1400, "max": 2100},
      "medium": {"label": "Medium (two-story or full siding)", "min": 2800, "max": 4200},
      "large": {"label": "Large (large home / multiple structures)", "min": 4800, "max": 7200}
    },
    "conditionMultipliers": {"good": 0.94, "fair": 1.0, "poor": 1.22},
    "addOns": [
      {"id": "pressure-wash", "label": "Pressure washing", "price": 220},
      {"id": "deck", "label": "Deck / fence included", "price": 380},
      {"id": "trim-exterior", "label": "Trim & shutters", "price": 260}
    ],
    "disclaimer": "This is an initial estimate based on the information provided. Final pricing may change after an on-site assessment."
  }'::jsonb),
  ('reparacion', '{
    "serviceId": "reparacion", "label": "Home Repairs", "pricingModel": "tiered", "allowAutoEstimate": true, "minimumPrice": 150,
    "tiers": {
      "small": {"label": "Small (single fix)", "min": 250, "max": 500},
      "medium": {"label": "Medium (several items)", "min": 600, "max": 1200},
      "large": {"label": "Large (multi-room repair)", "min": 1400, "max": 2600}
    },
    "conditionMultipliers": {"good": 0.94, "fair": 1.0, "poor": 1.22},
    "addOns": [
      {"id": "drywall", "label": "Drywall replacement", "price": 240},
      {"id": "carpentry", "label": "Carpentry work", "price": 300}
    ],
    "disclaimer": "This is an initial estimate based on the information provided. Final pricing may change after an on-site assessment."
  }'::jsonb)
on conflict (service_id) do nothing;
