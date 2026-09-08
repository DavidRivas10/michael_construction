# Michael Construction — sitio + panel admin

Sitio completo en Next.js (App Router) para Michael Construction: páginas
públicas, estimador con IA (mock por ahora), captura de leads con aviso
automático, y panel de administración.

Todo funciona **en modo demo** con datos de ejemplo desde el primer
`npm install` — no necesitas ninguna cuenta externa para probarlo.

## Arrancar en local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` para el sitio público y
`http://localhost:3000/admin` para el panel (contraseña demo: `demo1234`).

## Qué es real y qué es demo ahora mismo

| Pieza | Estado |
|---|---|
| Páginas públicas, estimador, formularios | Reales y funcionando |
| Guardado de leads | Real (archivo `data/leads.json`) |
| Aviso por correo al enviar un lead | Demo — se imprime en la consola del servidor hasta poner `RESEND_API_KEY` |
| Aviso por WhatsApp/SMS/llamada | Demo — se imprime en la consola hasta configurar Twilio |
| Rango de precio del estimador | Calculado con una tabla simple — hasta poner `ANTHROPIC_API_KEY` no lee las fotos de verdad |
| Fotos de portafolio | Bloques de color de ejemplo — falta conectar Supabase Storage/Cloudinary para fotos reales |
| Base de datos | Archivos JSON en `/data` — pensada para migrarse a Postgres sin tocar el resto del código (ver `lib/db.js`) |

## Activar los servicios reales

1. Copia `.env.example` a `.env.local` y llena lo que ya tengas.
2. **Correo** (Resend): crea cuenta gratis, genera una API key, pégala en `RESEND_API_KEY`.
3. **WhatsApp/SMS**: crea cuenta en Twilio, activa WhatsApp Business, pega `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_FROM`.
4. **Estimador con IA real** (lee las fotos): pega `ANTHROPIC_API_KEY` — la llamada real se agrega en `lib/estimator.js` donde está el comentario `estimateWithClaude`.
5. **Base de datos real**: cuando haya un proyecto de Supabase o Neon, se reemplaza únicamente `lib/db.js` — ninguna página ni ruta cambia.

## Desplegar

El proyecto está listo para Vercel: conecta el repositorio, agrega las
variables de entorno de `.env.example` en el dashboard de Vercel, y listo.

## Estructura

```
app/            páginas públicas + admin (App Router)
app/api/        rutas API (leads, estimador, admin, portafolio, config)
components/     UI compartida
lib/            db.js, notify.js, estimator.js, auth.js — la capa que se
                reemplaza por servicios reales sin tocar las páginas
data/           "base de datos" de demo en JSON
```
