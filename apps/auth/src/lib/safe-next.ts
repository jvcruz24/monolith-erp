export function safeNext(value: string | string[] | undefined, fallback = "/") {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (
    candidate &&
    candidate.startsWith("/") &&
    !candidate.startsWith("//") &&
    !candidate.startsWith("/\\")
  ) {
    return candidate;
  }
  return fallback;
}
