export function makeSlug(name: string) {
  const base =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "company";
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(2)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return `${base}-${suffix}`;
}
