# MyPlanzo web

Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + **Prisma** + **Supabase (PostgreSQL)**. Deployed target: **Vercel**. Payments: **Razorpay** (order API + webhook). Implements the MyPlanzo Events MVP: customer marketplace flows, vendor listings and bookings, admin panel aligned with `UIUX/` PNGs, SMS OTP (mock in dev), booking-scoped messaging via REST + polling, and 15% commission tracking.

## Database: Supabase

Prisma uses two connection strings (see [Prisma + Supabase](https://www.prisma.io/docs/orm/overview/databases/supabase)):

| Variable | Use |
| --- | --- |
| `DATABASE_URL` | **Transaction pooler** (port `6543`, host like `*.pooler.supabase.com`) for the app on Vercel. Include `pgbouncer=true` and a small `connection_limit` in the query string when Supabase docs recommend it. |
| `DIRECT_URL` | **Direct** Postgres (`db.*.supabase.co`, port `5432`) for `prisma migrate`, `db push`, and `db seed`. |

For **local dev** without Supabase, set `DATABASE_URL` and `DIRECT_URL` to the **same** Postgres URL (for example the optional [Docker Compose](./docker-compose.yml) service).

## Hosting: Vercel

1. Connect the Git repo and set the **root** to this project (if the repo is monorepo-only, set the app directory accordingly).
2. In **Settings → Environment Variables**, add at least:
   - `DATABASE_URL` (pooler)
   - `DIRECT_URL` (direct)
   - `AUTH_SECRET` (long random string)
   - `NEXT_PUBLIC_APP_URL` (your production URL, e.g. `https://myplanzo.vercel.app`)
   - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - SMS provider keys when you move off `SMS_PROVIDER=mock`
3. **Build command:** `npm run build` (default). **Install:** `npm install` (default).
4. After first deploy, run migrations from your machine (or CI) against `DIRECT_URL`:
   - `npx prisma db push` or `npx prisma migrate deploy` once the schema is finalized.

**Razorpay webhook:** in the Razorpay dashboard, set the webhook URL to:

`https://<YOUR_VERCEL_DOMAIN>/api/webhooks/razorpay`

Use the same signing secret as `RAZORPAY_WEBHOOK_SECRET`.

## Quick start (local)

1. Copy [`.env.example`](./.env.example) to `.env` and fill Supabase URLs (or local Postgres for both `DATABASE_URL` and `DIRECT_URL`).
2. `npm install`
3. `npx prisma db push`
4. `npx prisma db seed` — creates the [test accounts](#test-accounts) below (password **`admin1`** for all).
5. `npm run dev` — [http://localhost:3000](http://localhost:3000)

Optional local DB: `docker compose up -d` then use the compose credentials in both `DATABASE_URL` and `DIRECT_URL`.

### Test accounts

Each user has a single role in the database (unique email). Password for every seeded account: **`admin1`**.

| Portal | Email | Notes |
| --- | --- | --- |
| Admin | `admin@gmail.com` | Signs in with password only (no SMS OTP). |
| Customer | `admin+customer@gmail.com` | Gmail delivers this to the same inbox as `admin@gmail.com`. After password, enter the **SMS OTP** (see below). |
| Vendor | `admin+vendor@gmail.com` | Same Gmail inbox trick. Vendor profile is seeded **ACTIVE** so listings can go live after you add them. |

**Where to get the login OTP (customer / vendor):** Real SMS is not sent while `SMS_PROVIDER` is unset or `mock`. After you submit email + password, open the **Verify OTP** screen: in **development** the OTP is shown in the yellow banner on that page and printed in the terminal running `npm run dev` as `[SMS mock] OTP for +91… (login): 123456`. You can also inspect the **Network** tab → response JSON from `POST /api/auth/login` → field `devOtp` (dev only).

If you need literally one email string for every portal, the app would require multi-role users or separate login tables; the seed instead uses **plus-address aliases** so you can test all three flows from one mailbox with one password.

## Routes

- **Auth:** `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password`
- **Customer:** `/customer`, `/customer/browse`, shortlist, bookings, listing detail
- **Vendor:** `/vendor`, listings, bookings (accept/decline)
- **Admin:** `/admin` (dashboard, users, services, CMS hub, subadmins, commissions, reports, bookings)

UI ↔ route map: [`docs/ui-routes.md`](./docs/ui-routes.md). Design tokens live in [`src/app/globals.css`](./src/app/globals.css) (`@theme`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `start` | Production |
| `npm run test` | Vitest (`src/**/*.test.ts`) |
| `npm run lint` | ESLint |
| `npx prisma studio` | DB browser (uses `DIRECT_URL` / direct connection) |

## Architecture notes

- **Auth:** Password + JWT in httpOnly cookie; customers/vendors complete SMS OTP after login/register (mock logs OTP to server console when `SMS_PROVIDER` unset). Admins sign in with password only.
- **Payments (Razorpay):** `POST /api/payments/create-order` creates a Razorpay order when `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` are set; otherwise returns a mock order id. In development, customer UI can call `POST /api/payments/mock-capture` after create-order for end-to-end testing. Production uses the webhook above.
- **Messaging:** [`src/lib/messaging/messageService.ts`](./src/lib/messaging/messageService.ts) stores `sender_role`, `receiver_role`, `booking_id`, and `channel` (default `web`) for future WhatsApp. The MVP UI uses **REST + short polling**; a WebSocket gateway can call the same service without changing the data model.
- **Middleware:** Protects `/admin`, `/vendor`, `/customer` by role ([`src/middleware.ts`](./src/middleware.ts)).

## Contract / design scope

Some admin CMS screens are present as shells; full editorial workflows depend on client confirmation beyond MVP §1.9. Marketplace customer/vendor pixel-perfect screens follow shared tokens until additional PNGs are added under `UIUX/`.
"# website" 
