import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isValidLocale, isRTL, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { getRecipeBySlug, getRecipeSlugs } from "@/lib/recipes";
import InteractiveRecipe from "@/components/InteractiveRecipe";

// ─── Static params — all locale × slug combinations ───────────────────────────
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getRecipeSlugs(locale).map((slug) => ({ locale, slug })),
  );
}

export const dynamicParams = false;

// ─── Per-page metadata ────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const recipe = getRecipeBySlug(slug, locale);
  return {
    title: recipe.frontmatter.title,
    description: recipe.frontmatter.description,
  };
}

// ─── Difficulty badge colours — adapted for light stone background ─────────────
const DIFFICULTY_COLOURS: Record<string, string> = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-rose-700    bg-rose-50    border-rose-200",
  "مبتدئ":      "text-emerald-700 bg-emerald-50 border-emerald-200",
  "متوسط":      "text-amber-700   bg-amber-50   border-amber-200",
  "متقدم":      "text-rose-700    bg-rose-50    border-rose-200",
};

// ─── Category → icon map (same as home page) ──────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  Equipment: "⚙️", Techniques: "🎯", "Cold Drinks": "🧊",
  "المعدات": "⚙️", "تقنيات": "🎯", "مشروبات باردة": "🧊",
  Espresso: "☕", "Cold Blended": "🧊", "Cold Brew": "🧋",
};

// ─── Recipe page ──────────────────────────────────────────────────────────────
export default async function RecipePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const rtl = isRTL(locale);

  let recipe;
  try {
    recipe = getRecipeBySlug(slug, locale);
  } catch {
    notFound();
  }

  const { frontmatter, content } = recipe;
  const displayTime = frontmatter.prep_time ?? frontmatter.time;
  const difficultyClass =
    DIFFICULTY_COLOURS[frontmatter.difficulty] ?? DIFFICULTY_COLOURS.Intermediate;

  return (
    <div className="min-h-dvh flex flex-col">

      {/* ── Sticky top nav — frosted stone glass ─────────────────────────── */}
      <nav
        className="sticky top-0 z-10 flex items-center gap-3 border-b px-5 py-3"
        style={{
          borderColor: "var(--border-stone)",
          backgroundColor: "var(--bg-glass)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <Link
          href={`/${locale}`}
          id="back-to-home"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors"
          style={{ color: "var(--accent)" }}
          aria-label={dict.allRecipes}
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d={rtl ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
          </svg>
          {dict.allRecipes}
        </Link>

        <div className="flex-1" />

        {/* Category chip */}
        <span
          className="hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
          style={{
            backgroundColor: "rgba(184,148,58,0.10)",
            color: "var(--accent)",
            border: "1px solid var(--border)",
          }}
        >
          {CATEGORY_ICONS[frontmatter.category] ?? "✦"} {frontmatter.category}
        </span>

        {frontmatter.difficulty && (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${difficultyClass}`}
          >
            {frontmatter.difficulty}
          </span>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <header className="px-5 pt-8 pb-6 animate-fade-up">
        {/* Category label */}
        <span
          className="mb-2 block text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          {frontmatter.category}
        </span>

        <h1
          className="text-3xl font-extrabold leading-tight tracking-tight"
          style={{ color: "var(--text)" }}
        >
          {frontmatter.title}
        </h1>

        {frontmatter.description && (
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            {frontmatter.description}
          </p>
        )}

        {/* Meta strip */}
        <div className="mt-4 flex flex-wrap gap-3">
          {displayTime && (
            <StatPill icon="⏱" label={dict.prepTime} value={displayTime} />
          )}
          {frontmatter.yield && (
            <StatPill icon="🥤" label={dict.yieldLabel} value={frontmatter.yield} />
          )}
        </div>

        {/* Tags */}
        {frontmatter.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: "rgba(184,148,58,0.10)",
                  color: "var(--accent)",
                  border: "1px solid var(--border)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Brass-tinted divider */}
      <div className="mx-5 brass-line" />

      {/* ── Recipe content ────────────────────────────────────────────────── */}
      <main className="flex-1 px-5 pt-6 pb-28 animate-fade-up stagger-2">
        <InteractiveRecipe content={content} slug={slug} category={frontmatter.category} />
      </main>

      {/* ── Sticky bottom nav — frosted stone ─────────────────────────────── */}
      <div
        className="sticky bottom-0 border-t px-5 py-4"
        style={{
          borderColor: "var(--border-stone)",
          backgroundColor: "var(--bg-glass)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <Link
          href={`/${locale}`}
          className="btn-gold flex w-full items-center justify-center gap-2 py-3 text-sm font-semibold transition-all active:opacity-80"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          {dict.backToGuide}
        </Link>
      </div>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-3 py-2"
      style={{
        borderColor: "var(--border-stone)",
        backgroundColor: "var(--bg-glass-solid)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <span className="text-base" aria-hidden>{icon}</span>
      <div>
        <p
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-subtle)" }}
        >
          {label}
        </p>
        <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
