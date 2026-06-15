"use client";

import { useState, useMemo, useId } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { RecipeFull, RecipeListItem } from "@/lib/recipes";
import type { Dict } from "@/lib/dictionaries";
import { useFavorites } from "@/hooks/useFavorites";

// ─── Category Icons ────────────────────────────────────────────────────────────
// Kept co-located so the client bundle doesn't import the server-only page.tsx map.
const CATEGORY_ICONS: Record<string, string> = {
  // English
  Equipment:                "⚙️",
  Techniques:               "🎯",
  "Cold Drinks":            "🧊",
  "Iced & Hot Coffee":      "☕",
  Frappes:                  "🥤",
  Milkshakes:               "🍦",
  Desserts:                 "🍨",
  "Smoothies & Refreshers": "🍹",
  Espresso:                 "☕",
  "Steamed Milk":           "🥛",
  "Cold Blended":           "🧊",
  "Pour Over":              "🫖",
  "Cold Brew":              "🧋",
  Filter:                   "☕",
  "Hot Espresso":           "☕",
  "Flavoured Lattes":       "🌸",
  "Non-Coffee":             "🍵",
  "Manual Brew":            "🫖",
  // Arabic
  "المعدات":                "⚙️",
  "تقنيات":                 "🎯",
  "مشروبات باردة":          "🧊",
  "مشروبات القهوة":         "☕",
  "مشروبات الفرابيه":       "🥤",
  "مشروبات الميلك شيك":    "🍦",
  "إضافات القهوة والآيس كريم": "🍨",
  "السموذي والمنعشات":      "🍹",
  "إسبريسو":                "☕",
  "حليب مبخر":              "🥛",
  "قهوة باردة":             "🧋",
  "بور أوفر":               "🫖",
  "إسبريسو ساخن":          "☕",
  "لاتيه منكّه":            "🌸",
  "مشروبات غير قهوية":      "🍵",
  "القهوة المختصة":         "🫖",
  Default:                  "✦",
};

const DIFFICULTY_COLOURS: Record<string, string> = {
  Beginner:     "text-emerald-700 bg-emerald-50 border-emerald-200",
  Intermediate: "text-amber-700   bg-amber-50   border-amber-200",
  Advanced:     "text-rose-700    bg-rose-50    border-rose-200",
  "مبتدئ":      "text-emerald-700 bg-emerald-50 border-emerald-200",
  "متوسط":      "text-amber-700   bg-amber-50   border-amber-200",
  "متقدم":      "text-rose-700    bg-rose-50    border-rose-200",
};

// ─── Props ─────────────────────────────────────────────────────────────────────
interface RecipeBrowserProps {
  recipes: RecipeFull[];
  categories: string[];
  locale: string;
  dict: Pick<Dict,
    | "searchPlaceholder"
    | "allCategories"
    | "noRecipes"
    | "noResults"
    | "difficulty"
  >;
  rtl: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function RecipeBrowser({
  recipes,
  categories,
  locale,
  dict,
  rtl,
}: RecipeBrowserProps) {
  const searchId = useId();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("__all__");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, mounted } = useFavorites();

  // ─── Derived filtered list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recipes.filter((r) => {
      if (showFavoritesOnly && !isFavorite(r.slug)) return false;

      const matchesSearch =
        q === "" ||
        r.frontmatter.title.toLowerCase().includes(q) ||
        (r.frontmatter.description ?? "").toLowerCase().includes(q) ||
        r.frontmatter.category.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q); // Deep search

      const matchesCategory =
        selectedCategory === "__all__" ||
        r.frontmatter.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, searchQuery, selectedCategory, showFavoritesOnly, isFavorite]);

  // ─── Group filtered results by category ──────────────────────────────────
  const byCategory = useMemo(() => {
    return filtered.reduce<Record<string, RecipeListItem[]>>((acc, recipe) => {
      const cat = recipe.frontmatter.category ?? "Uncategorised";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(recipe);
      return acc;
    }, {});
  }, [filtered]);

  // Maintain consistent category order (sorted, same as server)
  const visibleCategories = useMemo(
    () => Object.keys(byCategory).sort(),
    [byCategory],
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-0">
      {/* ── Search Bar ─────────────────────────────────────────────────── */}
      <div className="px-5 pb-3 animate-fade-up stagger-1">
        <label htmlFor={searchId} className="sr-only">
          {dict.searchPlaceholder}
        </label>
        <div
          className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
          style={{
            borderColor: "var(--border-stone)",
            backgroundColor: "var(--bg-glass-solid)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
          // Highlight border on focus-within
          onFocus={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "var(--accent)";
            (e.currentTarget as HTMLDivElement).style.boxShadow =
              "0 0 0 3px rgba(184,148,58,0.15)";
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              (e.currentTarget as HTMLDivElement).style.borderColor =
                "var(--border-stone)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }
          }}
        >
          {/* Search SVG icon */}
          <svg
            className="h-4 w-4 shrink-0"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>

          <input
            id={searchId}
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.searchPlaceholder}
            dir={rtl ? "rtl" : "ltr"}
            className="flex-1 bg-transparent text-sm outline-none placeholder:select-none"
            style={{
              color: "var(--text)",
              caretColor: "var(--accent)",
            }}
          />

          {/* Clear button — appears when there's a query */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="shrink-0 rounded-full p-0.5 transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Category Filter Pills ───────────────────────────────────────── */}
      <div className="px-5 pb-5 animate-fade-up stagger-2 pills-scroll">
        {/* Hide scrollbar visually but keep it functional */}
        <div
          className={`flex gap-2 ${rtl ? "flex-row-reverse" : ""}`}
          style={{ width: "max-content", minWidth: "100%" }}
        >
          {/* Favorites toggle */}
          {mounted && (
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer"
              style={
                showFavoritesOnly
                  ? {
                      background: "rgba(225,29,72,0.1)",
                      color: "#e11d48",
                      borderColor: "rgba(225,29,72,0.3)",
                      boxShadow: "0 2px 10px rgba(225,29,72,0.15)",
                      transform: "translateY(-1px)",
                    }
                  : {
                      backgroundColor: "var(--bg-glass-solid)",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                      borderColor: "var(--border-stone)",
                      color: "var(--text)",
                    }
              }
            >
              <Heart className="h-3 w-3" fill={showFavoritesOnly ? "currentColor" : "none"} />
              {rtl ? "المفضلة" : "Favorites"}
            </button>
          )}

          {/* "All" pill */}
          <CategoryPill
            label={dict.allCategories}
            active={selectedCategory === "__all__"}
            onClick={() => setSelectedCategory("__all__")}
          />

          {/* One pill per unique category (original sort order from server) */}
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={`${CATEGORY_ICONS[cat] ?? "✦"} ${cat}`}
              active={selectedCategory === cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? "__all__" : cat)
              }
            />
          ))}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <main className="flex-1 px-5 pb-28 space-y-8">
        {recipes.length === 0 ? (
          /* No content at all */
          <EmptyState message={dict.noRecipes} />
        ) : filtered.length === 0 ? (
          /* Has content but nothing matches the current filter */
          <EmptyState message={dict.noResults} />
        ) : (
          visibleCategories.map((category, catIdx) => (
            <section key={category} aria-labelledby={`cat-${catIdx}`}>

              {/* Category heading */}
              <div
                className={`mb-3 flex items-center gap-2.5 ${
                  rtl ? "flex-row-reverse" : ""
                }`}
              >
                <span className="text-lg" aria-hidden>
                  {CATEGORY_ICONS[category] ?? CATEGORY_ICONS.Default}
                </span>
                <h2
                  id={`cat-${catIdx}`}
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--accent)" }}
                >
                  {category}
                </h2>
                <div className="flex-1 brass-line" />
                <span
                  className="text-xs font-medium tabular-nums"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {byCategory[category].length}
                </span>
              </div>

              {/* Recipe cards */}
              <ul className="space-y-3" role="list">
                {byCategory[category].map((recipe, idx) => (
                  <li
                    key={recipe.slug}
                    className={`animate-fade-up stagger-${Math.min(idx + 2, 5)}`}
                  >
                    <Link
                      href={`/${locale}/recipes/${recipe.slug}`}
                      id={`recipe-${recipe.slug}`}
                      className={`glass-card flex items-center gap-4 p-4 no-underline ${
                        rtl ? "flex-row-reverse" : ""
                      }`}
                    >
                      {/* Category icon bubble */}
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                        style={{
                          backgroundColor: "rgba(184,148,58,0.10)",
                          border: "1px solid var(--border)",
                        }}
                      >
                        {CATEGORY_ICONS[recipe.frontmatter.category] ??
                          CATEGORY_ICONS.Default}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className={`flex items-center gap-2 ${rtl ? "flex-row-reverse" : ""}`}>
                          <p
                            className="truncate text-base font-semibold leading-snug"
                            style={{ color: "var(--text)" }}
                          >
                            {recipe.frontmatter.title}
                          </p>
                          {mounted && isFavorite(recipe.slug) && (
                            <Heart className="h-3.5 w-3.5 shrink-0 text-rose-500" fill="currentColor" />
                          )}
                        </div>
                        <p
                          className="mt-0.5 truncate text-xs leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {recipe.frontmatter.description ??
                            recipe.frontmatter.category}
                        </p>

                        {/* Meta pills */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {recipe.frontmatter.difficulty && (
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                                DIFFICULTY_COLOURS[
                                  recipe.frontmatter.difficulty
                                ] ?? DIFFICULTY_COLOURS.Intermediate
                              }`}
                            >
                              {dict.difficulty[
                                recipe.frontmatter
                                  .difficulty as keyof typeof dict.difficulty
                              ] ?? recipe.frontmatter.difficulty}
                            </span>
                          )}
                          {(recipe.frontmatter.prep_time ??
                            recipe.frontmatter.time) && (
                            <span
                              className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                color: "var(--text-muted)",
                                borderColor: "var(--border-stone)",
                                backgroundColor: "rgba(255,255,255,0.5)",
                              }}
                            >
                              ⏱{" "}
                              {recipe.frontmatter.prep_time ??
                                recipe.frontmatter.time}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Chevron arrow */}
                      <svg
                        className="h-4 w-4 shrink-0"
                        style={{ color: "var(--text-muted)" }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        aria-hidden
                      >
                        <path d={rtl ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CategoryPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer"
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, var(--brass-600) 0%, var(--brass-400) 100%)",
              color: "#fff",
              borderColor: "transparent",
              boxShadow: "0 2px 10px rgba(184,148,58,0.35)",
              transform: "translateY(-1px)",
            }
          : {
              backgroundColor: "var(--bg-glass-solid)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderColor: "var(--border-stone)",
              color: "var(--text)",
            }
      }
    >
      {label}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="py-20 text-center"
      style={{ color: "var(--text-subtle)" }}
    >
      {/* Coffee cup doodle */}
      <div className="mb-4 text-4xl select-none" aria-hidden>
        ☕
      </div>
      <p className="text-sm leading-relaxed">{message}</p>
    </div>
  );
}
