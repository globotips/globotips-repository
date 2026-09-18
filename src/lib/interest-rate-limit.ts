const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

const hits = new Map<string, number[]>();

export function isInterestRateLimited(
  key: string,
  now = Date.now(),
  limit = MAX_HITS,
  windowMs = WINDOW_MS,
): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  return false;
}

export function resetInterestRateLimitForTests() {
  hits.clear();
}

export function recentInterestWindowMs() {
  return WINDOW_MS;
}
