"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render a placeholder of the exact same size to prevent layout shift
    return <div className="h-8 w-8" aria-hidden />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? (
        <Sun className="h-4 w-4" style={{ color: "var(--brass-400)" }} />
      ) : (
        <Moon className="h-4 w-4" style={{ color: "var(--granite-700)" }} />
      )}
    </button>
  );
}
