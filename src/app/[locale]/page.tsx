import { notFound } from "next/navigation";
import { isValidLocale, isRTL, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getAllRecipesFull } from "@/lib/recipes";
import RecipeBrowser from "@/components/RecipeBrowser";

// ─── Casadio-inspired espresso machine SVG icon ────────────────────────────────
function CasadioIcon() {
  return (
    <svg
      viewBox="0 0 48 32"
      fill="none"
      className="h-12 w-auto"
      aria-hidden
    >
      {/* Machine body */}
      <rect x="2" y="8" width="44" height="18" rx="3" fill="var(--steel, #6B7280)" opacity="0.85" />
      {/* Front panel */}
      <rect x="4" y="10" width="40" height="14" rx="2" fill="#5A5F68" />
      {/* Group head 1 */}
      <rect x="10" y="22" width="6" height="5" rx="1" fill="#4A4F58" />
      <rect x="11" y="27" width="4" height="2" rx="1" fill="#3A3F48" />
      {/* Group head 2 */}
      <rect x="32" y="22" width="6" height="5" rx="1" fill="#4A4F58" />
      <rect x="33" y="27" width="4" height="2" rx="1" fill="#3A3F48" />
      {/* Steam wand */}
      <line x1="44" y1="12" x2="46" y2="20" stroke="#9AA0A8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Buttons row */}
      <circle cx="20" cy="15" r="1.5" fill="var(--brass-600, #B8943A)" />
      <circle cx="24" cy="15" r="1.5" fill="var(--brass-600, #B8943A)" />
      <circle cx="28" cy="15" r="1.5" fill="var(--brass-600, #B8943A)" />
      {/* Pressure gauge */}
      <circle cx="8" cy="15" r="3" fill="#3A3F48" stroke="#9AA0A8" strokeWidth="0.75" />
      <line x1="8" y1="15" x2="9.5" y2="13.5" stroke="var(--brass-400, #D4AE56)" strokeWidth="0.75" strokeLinecap="round" />
      {/* Drip tray */}
      <rect x="4" y="26" width="40" height="2.5" rx="1" fill="#9AA0A8" opacity="0.5" />
      {/* CASADIO text hint */}
      <rect x="16" y="11" width="16" height="2" rx="1" fill="#9AA0A8" opacity="0.3" />
    </svg>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  // Fetch all recipes server-side; extract unique categories maintaining sort
  const allRecipes = getAllRecipesFull(locale);
  const totalRecipes = allRecipes.length;

  // Ordered unique categories (same sort as before — alphabetical by title means
  // categories emerge in the order the first recipe of each appears; we sort
  // the category list explicitly for a consistent UI).
  const categories = Array.from(
    new Set(allRecipes.map((r) => r.frontmatter.category ?? "Uncategorised"))
  ).sort();

  return (
    <div className="min-h-dvh flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden px-5 pt-10 pb-8 text-center">
        {/* Decorative brass orb glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div
            className="mt-0 h-72 w-72 rounded-full opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(184,148,58,0.18) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="animate-fade-up relative">
          {/* Casadio machine icon */}
          <div className="flex justify-center mb-4">
            <CasadioIcon />
          </div>

          <h1 className="gradient-text text-5xl font-extrabold tracking-tight leading-none">
            {dict.appName}
          </h1>

          <p
            className="mx-auto mt-3 max-w-xs text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            {dict.tagline}
          </p>

          {/* Brand inventory pills */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {["Monin", "Gia Beans", "Casadio", "Miscela Bar"].map((b) => (
              <span key={b} className="brand-badge">{b}</span>
            ))}
          </div>

          {/* Stats pill */}
          <div
            className="mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "rgba(184,148,58,0.08)",
              color: "var(--accent)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--accent)", animation: "breathe 2s ease-in-out infinite" }}
            />
            {dict.recipesReady(totalRecipes)}
          </div>
        </div>
      </header>

      {/* ── Client-side Search + Filter + Recipe Grid ─────────────────────── */}
      <RecipeBrowser
        recipes={allRecipes}
        categories={categories}
        locale={locale}
        dict={{
          searchPlaceholder: dict.searchPlaceholder,
          allCategories: dict.allCategories,
          noRecipes: dict.noRecipes,
          noResults: dict.noResults,
          difficulty: dict.difficulty,
        }}
        rtl={rtl}
      />

      <footer
        className="pb-4 text-center text-[11px]"
        style={{ color: "var(--text-subtle)" }}
      >
        {dict.footerNote}
      </footer>

      {/* ── Signature Footer ────────────────────────────────────────────── */}
      <div className="mx-auto mb-12 mt-4 flex max-w-2xl flex-col items-center justify-center gap-6 border-t border-gray-200 dark:border-gray-800 pt-8 md:flex-row">
        {/* Glow Container */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-amber-700 opacity-50 blur"></div>
          <img
            src="/gaith-signature.png"
            alt="Eng. Gaith Alasmar"
            className="relative z-10 h-20 w-20 rounded-full border-2 border-amber-600 object-cover shadow-2xl"
          />
        </div>
        
        {/* Text Container */}
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">Crafted with Passion by</p>
          <h2 className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-white">
            <span className="text-amber-500">Eng.</span> Gaith Alasmar <span aria-hidden>☕</span>
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-500">PWA Digital Artisan | Jordan</p>
        </div>
      </div>
    </div>
  );
}
