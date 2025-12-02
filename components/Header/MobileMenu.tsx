"use client";

import { useState, useEffect } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { usePlatform, Platform, PLATFORMS } from "@/contexts/PlatformContext";
import { MobileNavLink } from "./NavLink";
import { FlameIcon, FocusIcon, ChevronDownIcon } from "@/components/icons";

interface MobileMenuProps {
  pathname: string;
  onClose: () => void;
}

export function MobileMenu({ pathname }: MobileMenuProps) {
  const { stats, isLoaded } = useGamification();
  const [showPrefs, setShowPrefs] = useState(false);

  return (
    <div className="md:hidden bg-bg-primary border-t-3 border-border">
      <nav className="container-default py-4">
        {/* Primary Navigation */}
        <div className="space-y-1 mb-4">
          <MobileNavLink href="/" active={pathname === "/"}>
            Accueil
          </MobileNavLink>
          <MobileNavLink href="/blog" active={pathname.startsWith("/blog")}>
            Articles
          </MobileNavLink>
          <MobileNavLink href="/concepts" active={pathname.startsWith("/concepts")}>
            Concepts
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1 mb-4">
          <MobileNavLink href="/parcours" active={pathname.startsWith("/parcours")}>
            Parcours
          </MobileNavLink>
          <MobileNavLink href="/glossaire" active={pathname.startsWith("/glossaire")}>
            Glossaire
          </MobileNavLink>
          <MobileNavLink href="/series" active={pathname.startsWith("/series")}>
            Séries
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* User Section */}
        <div className="space-y-1 mb-4">
          {isLoaded && stats.currentStreak > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400">
              <span className="text-amber-500 dark:text-amber-400">
                <FlameIcon size={24} />
              </span>
              <div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-lg">
                  {stats.currentStreak}
                </span>
                <span className="text-sm text-text-muted ml-2">jours de streak</span>
              </div>
            </div>
          )}
          <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink href="/favoris" active={pathname === "/favoris"}>
            Mes favoris
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* Preferences Accordion */}
        <div>
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className="flex items-center justify-between w-full px-4 py-3 text-left font-body font-semibold text-text-muted"
          >
            Préférences
            <ChevronDownIcon size={14} className={`transition-transform ${showPrefs ? "rotate-180" : ""}`} />
          </button>

          {showPrefs && (
            <div className="px-4 py-4 bg-bg-tertiary border-l-4 border-border">
              <MobileSettingsPanel />
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

function MobileSettingsPanel() {
  const { fontSize, setFontSize, contrastMode, setContrastMode, focusMode, toggleFocusMode, isLoaded } = useAccessibility();
  const { platform, setPlatform, isLoaded: platformLoaded } = usePlatform();
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

  if (!mounted || !isLoaded || !platformLoaded) return null;

  return (
    <div className="space-y-4">
      {/* Theme */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Thème
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDark(false)}
            className={`flex-1 py-2 border-3 font-semibold ${!isDark ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Clair
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`flex-1 py-2 border-3 font-semibold ${isDark ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Sombre
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Taille texte
        </label>
        <div className="flex gap-1">
          {(["small", "normal", "large", "xlarge"] as const).map((size, i) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-2 border-3 font-bold ${fontSize === size ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
            >
              {["S", "M", "L", "XL"][i]}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Plateforme
        </label>
        <div className="flex gap-1">
          {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(
            ([key, value]) => (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`flex-1 py-2 border-3 font-mono text-xs font-bold ${platform === key ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary text-text-muted"}`}
                title={value.label}
              >
                {value.shortLabel}
              </button>
            )
          )}
        </div>
      </div>

      {/* Contrast */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Contraste
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setContrastMode("normal")}
            className={`flex-1 py-2 border-3 font-semibold ${contrastMode === "normal" ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Normal
          </button>
          <button
            onClick={() => setContrastMode("high")}
            className={`flex-1 py-2 border-3 font-semibold ${contrastMode === "high" ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Élevé
          </button>
        </div>
      </div>

      {/* Focus Mode */}
      <button
        onClick={toggleFocusMode}
        className={`w-full py-3 border-3 font-semibold flex items-center justify-center gap-2 ${
          focusMode
            ? "border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-700"
            : "border-border bg-bg-secondary text-text-muted"
        }`}
      >
        <FocusIcon size={18} />
        {focusMode ? "Quitter le mode zen" : "Mode zen"}
      </button>
    </div>
  );
}
