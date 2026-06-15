"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function BrewTimer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 100); // 100ms precision
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggle = () => setIsRunning(!isRunning);
  const reset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const mins = Math.floor(time / 60000);
  const secs = Math.floor((time % 60000) / 1000);
  const ms = Math.floor((time % 1000) / 100);

  return (
    <div
      className="mb-6 flex flex-col items-center justify-center rounded-2xl border p-5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "rgba(184,148,58,0.04)",
      }}
    >
      <div className="mb-4 font-mono text-5xl font-light tabular-nums tracking-tight text-center" style={{ color: "var(--text)" }}>
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        <span className="text-2xl ml-1" style={{ color: "var(--text-muted)" }}>.{ms}</span>
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggle}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: isRunning ? "rgba(225,29,72,0.1)" : "var(--accent)",
            color: isRunning ? "#e11d48" : "#fff",
            boxShadow: isRunning ? "none" : "0 4px 14px rgba(184,148,58,0.3)",
          }}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 ml-1" fill="currentColor" />}
        </button>
        <button
          onClick={reset}
          disabled={time === 0 && !isRunning}
          className="flex h-12 w-12 items-center justify-center rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 disabled:opacity-30 disabled:hover:bg-transparent"
          style={{ color: "var(--text-muted)" }}
          aria-label="Reset timer"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
