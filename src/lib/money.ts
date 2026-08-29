const TAMPA_TZ = "America/New_York";

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function parseUsdToCents(raw: string): number | null {
  const value = Number.parseFloat(raw.trim());
  if (!Number.isFinite(value) || value < 1) {
    return null;
  }
  return Math.round(value * 100);
}

export function dayKey(date: Date): string {
  return date.toLocaleDateString("en-CA", { timeZone: TAMPA_TZ });
}

export function formatDayLabel(isoDay: string): string {
  const [year, month, day] = isoDay.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: TAMPA_TZ,
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
