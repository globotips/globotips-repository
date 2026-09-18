#!/usr/bin/env node
/**
 * Apply Prisma schema during Vercel builds so production gets InterestLead
 * without printing DATABASE_URL. Local and CI skip this (VERCEL is unset).
 */
import { spawnSync } from "node:child_process";

if (process.env.VERCEL !== "1") {
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.warn("Skipping prisma db push: DATABASE_URL is not set on this Vercel build.");
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--skip-generate"],
  {
    stdio: "inherit",
    env: process.env,
  },
);

process.exit(result.status ?? 1);
