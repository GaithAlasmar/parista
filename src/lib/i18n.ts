// ─── Supported locales ────────────────────────────────────────────────────────
export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}
