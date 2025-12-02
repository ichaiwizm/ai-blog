"use client";

import { useState, useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { usePlatform, Platform, PLATFORMS } from "@/contexts/PlatformContext";
import { SettingsIcon, FocusIcon } from "@/components/icons";

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { fontSize, setFontSize, contrastMode, setContrastMode, focusMode, toggleFocusMode, isLoaded } = useAccessibility();
  const { platform, setPlatform, isLoaded: platformLoaded } = usePlatform();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted || !isLoaded || !platformLoaded) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  const fontSizes = [
    { value: "small" as const, label: "S" },
    { value: "normal" as const, label: "M" },
    { value: "large" as const, label: "L" },
    { value: "xlarge" as const, label: "XL" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
        aria-label="Préférences"
        title="Préférences"
      >
        <SettingsIcon size={18} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          <div className="p-4 border-b-2 border-border-light">
            <h3 className="font-display text-lg text-text-primary">Préférences</h3>
          </div>

          <div className="p-4 space-y-5">
            {/* Font Size */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
                Taille du texte
              </label>
              <div className="flex gap-1">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`
                      flex-1 py-2 border-3 font-body font-bold transition-all
                      ${fontSize === size.value
                        ? "border-accent bg-accent text-text-inverse"
                        : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                      }
                    `}
                  >
                    {size.label}
                  </button>
                ))}
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
                  className={`
                    flex-1 py-2 px-3 border-3 text-sm font-semibold transition-all
                    ${contrastMode === "normal"
                      ? "border-accent bg-accent text-text-inverse"
                      : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                    }
                  `}
                >
                  Normal
                </button>
                <button
                  onClick={() => setContrastMode("high")}
                  className={`
                    flex-1 py-2 px-3 border-3 text-sm font-semibold transition-all
                    ${contrastMode === "high"
                      ? "border-accent bg-accent text-text-inverse"
                      : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                    }
                  `}
                >
                  Élevé
                </button>
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
                      className={`
                        flex-1 py-2 border-3 font-mono text-xs font-bold transition-all
                        ${platform === key
                          ? "border-accent bg-accent text-text-inverse"
                          : "border-border bg-bg-tertiary hover:border-accent text-text-muted"
                        }
                      `}
                      title={value.label}
                    >
                      {value.shortLabel}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Focus Mode */}
            <button
              onClick={() => {
                toggleFocusMode();
                setIsOpen(false);
              }}
              className={`
                w-full py-3 px-4 border-3 font-body font-semibold text-sm
                flex items-center justify-center gap-2 transition-all
                ${focusMode
                  ? "border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                  : "border-border bg-bg-tertiary text-text-muted hover:border-accent hover:text-text-primary"
                }
              `}
            >
              <FocusIcon size={18} />
              {focusMode ? "Quitter le mode zen" : "Mode zen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
