/** US mobile for the hotel pilot. Stored as E.164 (+1XXXXXXXXXX). */
const NANP = /^[2-9]\d{2}[2-9]\d{6}$/;

export function parseUsMobile(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const digits = trimmed.replace(/\D/g, "");
  const national =
    digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
  if (!NANP.test(national)) {
    return null;
  }
  return `+1${national}`;
}

export function formatUsMobile(e164: string): string {
  const match = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  if (!match) {
    return e164;
  }
  return `(${match[1]}) ${match[2]}-${match[3]}`;
}
