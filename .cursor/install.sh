#!/usr/bin/env bash
# Idempotent bootstrap for the GloboTips Next.js demo app.
set -euo pipefail

cd "$(dirname "$0")/.."

# Create the local env file from the documented example on first setup.
# Never overwrite an existing .env (may contain local overrides).
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Install exact locked dependencies.
npm ci

# Generate the Prisma client, sync the SQLite schema, and seed demo data.
# Idempotent: hotel/employees are upserted and demo tips are only seeded
# when none exist yet.
npm run db:setup
