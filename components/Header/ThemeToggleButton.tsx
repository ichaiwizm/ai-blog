"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@/components/icons";

export function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(theme === "dark" || (!theme && prefersDark));
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  if (!mounted) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm hover:bg-accent hover:text-text-inverse"
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
