# Maykar Professional Painting — website + admin panel

Full Next.js (App Router) site for Maykar Professional Painting: public pages in
English, a configurable AI-assisted estimator, lead capture with
value/urgency-based notifications, and an admin panel the owner can run
without a developer.

Everything works **in demo mode** with sample data from the first
`npm install` — no external accounts needed to try it out.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the public site and
`http://localhost:3000/admin` for the panel. In development, the admin
password defaults to `demo1234` if `ADMIN_PASSWORD` isn't set — **in
production, `ADMIN_PASSWORD` and `SESSION_SECRET` are required and the app
will throw on boot if they're missing** (see `lib/auth.js`).

## What's real vs. demo right now

| Piece | Status |
|---|---|
| Public pages, estimator, forms | Real and working |
| Pricing engine (`lib/estimator.js` + `data/pricing.json`) | Real rules engine, fully admin-configurable at `/admin/pricing` — no AI ever sets the price |
| Lead capture & validation | Real — server-side validation, rate limiting, honeypot (`data/leads.json`) |
| Email notification on new lead | Demo — logged to the server console until `RESEND_API_KEY` is set |
| SMS/call notification | Demo — logged to console until Twilio is configured. Rules: email always; SMS only for high-value or confirmed-emergency leads; call only for confirmed emergencies (see `lib/notify.js`) |
| Photo-assisted estimating | Not active — with `ANTHROPIC_API_KEY`, Claude Vision would extract *observations* from photos (surface type, damage) to pre-fill the form; it never sets a price |
| Portfolio photos | Example color blocks — needs Supabase Storage/Cloudinary for real photos |
| Database | JSON files in `/data` — designed to migrate to Postgres without touching the rest of the code (see `lib/db.js`) |

## Turning on real services

1. Copy `.env.example` to `.env.local` and fill in what you have.
2. **Email** (Resend): create a free account, generate an API key, paste it into `RESEND_API_KEY`.
3. **SMS/Calls**: create a Twilio account, buy an SMS-capable phone number, paste `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_SMS_FROM`.
4. **Photo-assisted estimating**: paste `ANTHROPIC_API_KEY` — the real call goes in `lib/estimator.js` where the `analyzePhotosWithClaude` comment is. It only ever returns observations, never a price.
5. **Real database**: once there's a Supabase or Neon project, only `lib/db.js` gets replaced — no page or route changes.
6. **Admin panel in production**: set `ADMIN_PASSWORD` and `SESSION_SECRET` (long, random) — required, no fallback.

## Deploying

Ready for Vercel: connect the repo, add the environment variables from
`.env.example` in the Vercel dashboard, and deploy. Old Spanish routes
(`/servicios`, `/portafolio`, etc.) 301-redirect to their English
equivalents (see `next.config.js`) in case anything was bookmarked during
development.

## Structure

```
app/            public pages + admin (App Router), all public copy in English
app/api/        API routes (leads, estimate, pricing, admin, portfolio, config)
components/     shared UI — Reveal.js is the lightweight scroll-motion helper
lib/            db.js, notify.js, estimator.js, auth.js, rateLimit.js,
                validate.js — the layer that gets swapped for real services
                without touching pages
data/           demo "database" in JSON, including pricing.json (the
                estimator's rules — fully admin-editable)
```

## Notes for whoever picks this up next

- Admin panel content stays in Spanish (Michael's working language); all
  **public-facing** copy is English per the US-market requirement.
- Rate limiting (`lib/rateLimit.js`) is in-memory, per-process — fine for a
  single Vercel instance under moderate traffic. If this scales to
  multi-region/high-traffic, move it to Upstash Redis.
- `getClientIp` falls back to `"unknown"` when no `x-forwarded-for` header
  is present (e.g. local curl without a proxy) — on Vercel this header is
  always set, so it's not an issue in production, just worth knowing when
  testing locally.
