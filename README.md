# GloboTips

Cashless tipping for hotels, tour guides, and cruise staff. Guests scan a QR with their phone camera. There is no guest app, guest account, or guest login.

This repository is **Phase 1**: a working local demo. Checkout is shown and labeled as demo mode. **No real money is taken. Stripe is not connected.**

Public links are written as `globotips.com/tip/{code}`. The app itself can run on localhost or a preview host.

## Run locally

You need Node.js 20+.

```bash
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`db:setup` creates a local SQLite file at `prisma/dev.db`, generates the Prisma client, and seeds one Tampa hotel plus three employees.

## Demo hotel login

| | |
| --- | --- |
| Hotel | The Harbor Hotel, Tampa |
| Email | `tampa@globotips.com` |
| Password | `tampa-demo` |

Change `DEMO_HOTEL_EMAIL` / `DEMO_HOTEL_PASSWORD` in `.env` and run `npm run db:seed` again if you want different local credentials.

## Seeded guest pages

These open a phone-friendly tip page (name, photo placeholder, $5 / $10 / $20 / custom, then a demo pay step):

- [http://localhost:3000/tip/maria-santos](http://localhost:3000/tip/maria-santos)
- [http://localhost:3000/tip/james-okonkwo](http://localhost:3000/tip/james-okonkwo)
- [http://localhost:3000/tip/elena-rossi](http://localhost:3000/tip/elena-rossi)

Displayed staff links use `globotips.com/tip/{code}`. Downloaded QR PNGs encode `TIP_QR_ORIGIN` + `/tip/{code}` (defaults to `https://globotips.com`). Set `TIP_QR_ORIGIN=http://localhost:3000` in `.env` if you want a printed local QR to open this machine.

## What is in Phase 1

- Landing page at `/` (original Phase 1 landing kept at `/classic`)
- Hotel print kit at `/print` (desk cards, table tents, one-pager). PDFs live in `public/print/`; PNG previews for review are in `docs/print/`. Regenerate with `npm run print:kit`.
- Hotel admin at `/login` and `/admin`: add/remove employees, download QR PNGs, see **aggregate** totals by day and by employee
- Guest tip page at `/tip/{code}`
- Demo checkout only — the hotel never holds money, and individual tip amounts are not listed on the hotel dashboard

## What is not in this PR

Worker mobile app, multi-rail payouts, delayed tipping, NFC, Wallet passes, a front-desk pool code, real Stripe Connect charges, trademarks, or patents.

## Stack

Next.js (App Router), Prisma, SQLite. SQLite is for local demo only. Postgres can replace it later; this PR does not add a hosted database or any paid service.
