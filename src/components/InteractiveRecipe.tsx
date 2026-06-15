"use client";

import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import MarkdownRenderer from "./MarkdownRenderer";
import BrewTimer from "./BrewTimer";

interface Props {
  content: string;
  slug: string;
  category: string;
}

export default function InteractiveRecipe({ content, slug, category }: Props) {
  const { isFavorite, toggleFavorite, mounted } = useFavorites();
  const [multiplier, setMultiplier] = useState(1);

  const isManualBrew = category === "Manual Brew" || category === "القهوة المختصة";
  const fav = mounted && isFavorite(slug);

  return (
    <div className="relative">
      {/* Floating Controls Bar */}
      <div className="sticky top-[70px] z-20 flex items-center justify-between mb-6 px-1">
        {/* Scaler */}
        <div 
          className="flex items-center gap-3 rounded-full border px-3 py-1.5 shadow-sm"
          style={{
            borderColor: "var(--border-stone)",
            backgroundColor: "var(--bg-glass-solid)",
            backdropFilter: "blur(8px)",
          }}
        >
          <button 
            onClick={() => setMultiplier(m => Math.max(1, m - 1))}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm font-semibold tabular-nums w-4 text-center" style={{ color: "var(--text)" }}>
            {multiplier}
          </span>
          <button 
            onClick={() => setMultiplier(m => m + 1)}
            className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        {/* Favorite */}
        {mounted && (
          <button
            onClick={() => toggleFavorite(slug)}
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 border"
            style={{
              borderColor: fav ? "rgba(225,29,72,0.3)" : "var(--border-stone)",
              backgroundColor: fav ? "rgba(225,29,72,0.1)" : "var(--bg-glass-solid)",
              color: fav ? "#e11d48" : "var(--granite-500)",
              backdropFilter: "blur(8px)",
            }}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="h-5 w-5" fill={fav ? "currentColor" : "none"} />
          </button>
        )}
      </div>

      {isManualBrew && <BrewTimer />}

      <MarkdownRenderer content={content} multiplier={multiplier} />
    </div>
  );
}
