export function normalizePrefix(
  value: string | undefined,
  fallback: string,
): string {
  if (!value) return fallback;
  if (!value.trim()) return fallback;
  if (/\s/.test(value)) return fallback;
  return value;
}
