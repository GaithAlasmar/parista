import type { Locale } from "./i18n";

// ─── Dictionary shape ─────────────────────────────────────────────────────────
export interface Dict {
  appName: string;
  tagline: string;
  browseHint: string;
  searchPlaceholder: string;
  allCategories: string;
  noResults: string;
  recipesReady: (n: number) => string;
  noRecipes: string;
  allRecipes: string;
  backToGuide: string;
  prepTime: string;
  yieldLabel: string;
  footerNote: string;
  switchLang: string;
  difficulty: {
    Beginner: string;
    Intermediate: string;
    Advanced: string;
  };
}

// ─── English ──────────────────────────────────────────────────────────────────
const en: Dict = {
  appName: "Parista",
  tagline: "Bar guide — Monin · Gia Beans · Casadio Nettuno · Miscela Bar",
  browseHint: "Browse techniques & recipes…",
  searchPlaceholder: "Search drinks & techniques…",
  allCategories: "All",
  noResults: "No results found — try a different search or category.",
  recipesReady: (n) => `${n} ${n === 1 ? "guide" : "guides"} ready`,
  noRecipes: "No recipes yet — add a .md file to content/recipes/en/",
  allRecipes: "All Guides",
  backToGuide: "Back to Guides",
  prepTime: "Time",
  yieldLabel: "Yield",
  footerNote: "Parista · Powered by Casadio & Monin",
  switchLang: "عربي",
  difficulty: {
    Beginner: "Beginner",
    Intermediate: "Intermediate",
    Advanced: "Advanced",
  },
};

// ─── Arabic ───────────────────────────────────────────────────────────────────
const ar: Dict = {
  appName: "باريستا",
  tagline: "دليل البار — Monin · حبوب Gia · ماكينة Casadio · Miscela Bar",
  browseHint: "تصفح التقنيات والوصفات…",
  searchPlaceholder: "ابحث عن مشروب أو تقنية…",
  allCategories: "الكل",
  noResults: "لا توجد نتائج — جرّب كلمة بحث أو تصنيفاً آخر.",
  recipesReady: (n) => `${n} ${n === 1 ? "دليل" : "أدلة"} جاهزة`,
  noRecipes: "لا توجد وصفات بعد — أضف ملف .md إلى content/recipes/ar/",
  allRecipes: "جميع الأدلة",
  backToGuide: "العودة إلى الأدلة",
  prepTime: "الوقت",
  yieldLabel: "الكمية",
  footerNote: "باريستا · بالتعاون مع Casadio و Monin",
  switchLang: "English",
  difficulty: {
    Beginner: "مبتدئ",
    Intermediate: "متوسط",
    Advanced: "متقدم",
  },
};

// ─── Lookup ───────────────────────────────────────────────────────────────────
const dictionaries: Record<Locale, Dict> = { en, ar };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale];
}
