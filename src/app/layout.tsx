// Root layout — this file is required by Next.js App Router.
// The real <html> tag, lang, dir, and all PWA metadata live in
// src/app/[locale]/layout.tsx which acts as the true root layout.
// This file is only reached if a route somehow bypasses [locale] routing,
// e.g. the middleware-redirect target itself. It is intentionally minimal.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
