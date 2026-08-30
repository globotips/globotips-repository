# GloboTips

Cashless tipping for hotel staff and tour guides. Guests scan a QR with their phone camera. There is no guest app, guest account, or guest login.

Founders: **Rosalie Dudkiewicz** and **Dariusz Dudkiewicz**.

When `STRIPE_SECRET_KEY` is unset, checkout stays a local demo and nothing is charged. When test keys are set, guests pay through Stripe Checkout and the tip is a destination charge to that worker’s Express account. In production, live keys are allowed only when `STRIPE_MODE=live` **and** `NODE_ENV=production` are set on the host. GloboTips keeps 3% via `application_fee_amount`. The guest is not surcharged. The hotel never holds money.

Public links are written as `globotips.com/tip/{code}`. In live mode, Stripe Account Link return/refresh URLs and Checkout success/cancel URLs always use `https://www.globotips.com` (never localhost).

## Run locally

You need Node.js 20+ and a PostgreSQL `DATABASE_URL`. SQLite (`file:./dev.db`) is not supported.

The laptop demo does not need Docker. Use either:

- a free Neon / Vercel Postgres connection string (same shape as production), or
- Postgres you already have on the machine (Postgres.app, Homebrew, or the installer)

```bash
cp .env.example .env
# Set DATABASE_URL in .env to postgresql://...
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` generates the Prisma client, applies the schema (`prisma db push`), and seeds one Tampa hotel plus three employees. If you still have an old `prisma/dev.db` from SQLite, it is unused — point `.env` at Postgres and run `db:setup` again.

## Demo hotel login

| | |
| --- | --- |
| Hotel | The Harbor Hotel, Tampa |
| Email | `tampa@globotips.com` |
| Password | `tampa-demo` |

Change `DEMO_HOTEL_EMAIL` / `DEMO_HOTEL_PASSWORD` in `.env` and run `npm run db:seed` again if you want different local credentials.

## Seeded guest pages

- [http://localhost:3000/tip/maria-santos](http://localhost:3000/tip/maria-santos)
- [http://localhost:3000/tip/james-okonkwo](http://localhost:3000/tip/james-okonkwo)
- [http://localhost:3000/tip/elena-rossi](http://localhost:3000/tip/elena-rossi)

Displayed staff links use `globotips.com/tip/{code}`. Downloaded QR PNGs encode `TIP_QR_ORIGIN` + `/tip/{code}` (defaults to `https://globotips.com`). Set `TIP_QR_ORIGIN=http://localhost:3000` in `.env` if you want a printed local QR to open this machine.

## Stripe test mode

Leave Stripe env vars unset to keep the original demo pay form.

To run a real **test-mode** Connect + Checkout loop (no live charges):

1. In the Stripe Dashboard, use **test mode**. Enable [Connect](https://dashboard.stripe.com/test/connect) and Express accounts.
2. Copy the **test** secret key (`sk_test_...`) into `.env` as `STRIPE_SECRET_KEY`.
3. Optional: `STRIPE_PUBLISHABLE_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (`pk_test_...`). Checkout is created on the server, so these are not required for the current redirect flow.
4. Optional: `STRIPE_CONNECT_CLIENT_ID` (`ca_...`). Not used — onboarding uses Account Links, not OAuth.
5. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

6. Put the CLI signing secret (`whsec_...`) in `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.
7. Sign in as the Tampa hotel. For an existing employee, click **Start Stripe**. Adding a new employee starts Connect onboarding immediately.
8. Complete Express-style onboarding with Stripe test data (Accounts v2 merchant `card_payments` + recipient `stripe_transfers` + Express dashboard — the current Connect equivalent of Express). Live Stripe requires both capabilities on create. The QR is **live** only after recipient `stripe_transfers` and `payouts` are active.
9. Open `/tip/{code}` and pay with a [test card](https://docs.stripe.com/testing#cards) (`4242 4242 4242 4242`). Apple Pay / Google Pay appear on Checkout when the browser and domain support them.

The webhook `checkout.session.completed` records the paid tip. Returning from Checkout with `session_id` also records it (idempotent on the Checkout session id). `account.updated` refreshes whether that worker can receive payouts. If you create a Dashboard endpoint instead of the CLI, listen to those events on the platform and on connected accounts.

`sk_live_` / `pk_live_` are rejected on a laptop. A local `.env` cannot accidentally charge real cards.

## Production (globotips.com, live cards)

Set these **on the host** (never in git, never as committed files):

| Variable | Production value |
| --- | --- |
| `NODE_ENV` | `production` |
| `STRIPE_MODE` | `live` |
| `SESSION_SECRET` | long random string |
| `DATABASE_URL` | Neon / Vercel Postgres `postgresql://...` URL (see below). Never commit credentials. |
| `TIP_QR_ORIGIN` | `https://www.globotips.com` |
| `STRIPE_SECRET_KEY` | `sk_live_...` (host env only) |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (host env only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (host env only) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from the live endpoint |
| `STRIPE_CONNECT_CLIENT_ID` | optional (`ca_...`) |

Both flags are required. `STRIPE_MODE=live` without `NODE_ENV=production` still rejects live keys. `NODE_ENV=production` without `STRIPE_MODE=live` still rejects live keys.

### Production database on Vercel

SQLite will not persist on Vercel serverless. Production (and preview, if those deploys should store data) needs a Postgres `DATABASE_URL`.

1. Create a Neon or Vercel Postgres database (Vercel Dashboard → Storage, or Neon’s console). Copy the `postgresql://...` connection string. Do not put it in git.
2. In the Vercel project **globotips** (team **globo-tips**): Settings → Environment Variables. Add `DATABASE_URL` with that URL. Scope it to **Production**. Add it to **Preview** too if preview deployments should use a database (a Neon branch is fine).
3. If Neon injects `POSTGRES_URL` / `POSTGRES_PRISMA_URL` instead, still set `DATABASE_URL` — that is the name this app reads. A standard `postgresql://` URL is enough; this app does not use Neon-only APIs.
4. Apply the Prisma schema once against that URL (from a machine that has the URL in the environment, never from a committed file):

```bash
npx prisma db push
```

If `db push` fails with a prepared-statement or pgbouncer error, use Neon’s **direct** (non-`-pooler`) connection string for that command. The app runtime can keep using the pooled URL.

Do not run `npm run db:seed` against production unless you want the Tampa demo hotel there. Redeploy after the env var is saved so the functions pick it up. This repo does not deploy for you.

In live mode, Stripe Account Links use:

- return: `https://www.globotips.com/admin/connect/return?employee=...`
- refresh: `https://www.globotips.com/admin/connect/refresh?employee=...`

Checkout uses:

- success: `https://www.globotips.com/tip/{code}?paid=1&session_id={CHECKOUT_SESSION_ID}`
- cancel: `https://www.globotips.com/tip/{code}?canceled=1`

Point the live Stripe webhook at `https://www.globotips.com/api/webhooks/stripe` (`checkout.session.completed`, `checkout.session.async_payment_succeeded`, `account.updated`).

Destination charges stay the same: `application_fee_amount` is 3% of the tip. The guest is not surcharged. The hotel never holds money.

## What is in this app

- Landing page at `/` (founders Rosalie Dudkiewicz and Dariusz Dudkiewicz; hotel pays nothing to try; ~3% from the tip)
- Hotel admin at `/login` and `/admin`: add/remove employees, download QR PNGs, see **aggregate** totals by day and by employee
- Guest tip page at `/tip/{code}`: name, photo placeholder, $5 / $10 / $20 / custom
- Demo checkout when Stripe keys are missing
- Stripe Checkout destination charges in test mode when test keys are present
- Stripe Checkout destination charges in live mode when live keys and the production flags are set on the host
- Stripe Connect Express onboarding from hotel admin

## What is not in this app

Worker mobile app, multi-rail payouts (Pix / Wise / SEPA), delayed tipping, NFC, Wallet passes, a front-desk pool code, tax add-on, trademarks, or patents.

## Stack

Next.js (App Router), Prisma, PostgreSQL, Stripe. Local demo and production both use a `postgresql://` `DATABASE_URL`. Production should use Neon / Vercel Postgres so data persists on Vercel serverless.
