"use client";

import { useState, useEffect } from "react";
import { X, Share, PlusSquare } from "lucide-react";

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem("parista-pwa-dismissed");
    if (dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000) return; // wait 7 days

    // Check user agent
    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    // If mobile, show prompt
    if (/android|iphone|ipad|ipod/.test(ua)) {
      // Delay prompt slightly so it's not jarring
      setTimeout(() => setShow(true), 2000);
    }
  }, []);

  if (!show) return null;

  const handleDismiss = () => {
    localStorage.setItem("parista-pwa-dismissed", String(Date.now()));
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-fade-up">
      <div 
        className="relative mx-auto max-w-sm rounded-2xl border p-5 shadow-2xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-glass-solid)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        <button 
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-full p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="mb-2 text-lg font-bold" style={{ color: "var(--text)" }}>Install Parista</h3>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Add Parista to your home screen for quick offline access during service.
        </p>

        {isIOS ? (
          <div className="flex flex-col gap-2 rounded-xl bg-black/5 dark:bg-white/5 p-3 text-sm" style={{ color: "var(--text)" }}>
            <span className="flex items-center gap-2">1. Tap <Share className="h-4 w-4 text-blue-500" /> Share</span>
            <span className="flex items-center gap-2">2. Tap <strong className="flex items-center gap-1"><PlusSquare className="h-4 w-4" /> Add to Home Screen</strong></span>
          </div>
        ) : (
          <p className="text-xs text-center italic" style={{ color: "var(--text-muted)" }}>
            Tap the browser install prompt or use your browser menu to install.
          </p>
        )}
      </div>
    </div>
  );
}
