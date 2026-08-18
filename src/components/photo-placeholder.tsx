const PALETTES = [
  ["#0d5c4d", "#c4a15a"],
  ["#1c4a6e", "#d4b48a"],
  ["#6b3a2a", "#e0c7a0"],
  ["#3d4f3a", "#c4a15a"],
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "GT";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function paletteFor(name: string): [string, string] {
  let hash = 0;
  for (const char of name) {
    hash = (hash + char.charCodeAt(0)) % PALETTES.length;
  }
  return PALETTES[hash] as [string, string];
}

export function PhotoPlaceholder({
  name,
  size = 112,
}: {
  name: string;
  size?: number;
}) {
  const [from, to] = paletteFor(name);
  return (
    <div
      className="relative overflow-hidden rounded-full shadow-[0_8px_24px_rgba(28,43,38,0.16)] ring-4 ring-white"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Photo placeholder for ${name}`}
    >
      <div
        className="flex h-full w-full items-end justify-center"
        style={{
          background: `linear-gradient(160deg, ${from} 0%, ${to} 100%)`,
        }}
      >
        <span
          className="mb-3 font-display font-medium text-white/95"
          style={{ fontSize: size * 0.32 }}
        >
          {initials(name)}
        </span>
      </div>
    </div>
  );
}
