"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";

interface Props {
  currentLocale: Locale;
  switchLabel: string;
}

export default function LanguageSwitcher({ currentLocale, switchLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function handleSwitch() {
    const target: Locale = currentLocale === "en" ? "ar" : "en";
    // Replace the first segment of the path: /en/... → /ar/...
    const newPath = pathname.replace(/^\/(en|ar)/, `/${target}`);
    router.push(newPath);
  }

  return (
    <button
      id="lang-switcher"
      onClick={handleSwitch}
      aria-label={`Switch language to ${currentLocale === "en" ? "Arabic" : "English"}`}
      className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-all active:scale-95"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "rgba(184,148,58,0.10)",
        color: "var(--accent)",
      }}
    >
      {/* Globe icon instead of emojis for cleaner look */}
      <svg
        className="h-3.5 w-3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {switchLabel}
    </button>
  );
}
