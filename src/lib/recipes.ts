import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "./i18n";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecipeFrontmatter {
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prep_time: string;
  time?: string;          // alias used by some content files
  yield: string;
  tags: string[];
  description: string;
}

export interface RecipeListItem {
  slug: string;
  frontmatter: RecipeFrontmatter;
}

export interface RecipeFull extends RecipeListItem {
  content: string;
}

// ─── Path helper ──────────────────────────────────────────────────────────────

function recipesDir(locale: Locale): string {
  return path.join(process.cwd(), "content", "recipes", locale);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns all .md slugs for a given locale, excluding README.
 */
export function getRecipeSlugs(locale: Locale): string[] {
  const dir = recipesDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => f.replace(/\.md$/, ""));
}

/**
 * Returns the frontmatter + content for a single recipe by slug and locale.
 */
export function getRecipeBySlug(slug: string, locale: Locale): RecipeFull {
  const fullPath = path.join(recipesDir(locale), `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    frontmatter: data as RecipeFrontmatter,
    content,
  };
}

/**
 * Returns all recipes for a locale as list items (frontmatter only).
 * Sorted alphabetically by title.
 */
export function getAllRecipes(locale: Locale): RecipeListItem[] {
  return getRecipeSlugs(locale)
    .map((slug) => {
      const fullPath = path.join(recipesDir(locale), `${slug}.md`);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(raw);
      return { slug, frontmatter: data as RecipeFrontmatter };
    })
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

/**
 * Returns all recipes with their markdown content.
 * Useful for client-side deep search.
 */
export function getAllRecipesFull(locale: Locale): RecipeFull[] {
  return getRecipeSlugs(locale)
    .map((slug) => {
      const fullPath = path.join(recipesDir(locale), `${slug}.md`);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);
      return { slug, frontmatter: data as RecipeFrontmatter, content };
    })
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title));
}

/**
 * Groups recipes by category for a given locale.
 */
export function getRecipesByCategory(
  locale: Locale,
): Record<string, RecipeListItem[]> {
  const all = getAllRecipes(locale);
  return all.reduce<Record<string, RecipeListItem[]>>((acc, recipe) => {
    const cat = recipe.frontmatter.category ?? "Uncategorised";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(recipe);
    return acc;
  }, {});
}
