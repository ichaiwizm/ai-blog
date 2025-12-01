"use client";

import { useAccessibility, FontSize } from "@/contexts/AccessibilityContext";
import { useEffect, useState } from "react";

export default function FontSizeControls() {
  const { fontSize, setFontSize, contrastMode, setContrastMode, isLoaded } = useAccessibility();
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="w-10 h-10 bg-bg-tertiary border-2 border-border-light animate-pulse" />
    );
  }

  const fontSizes: { value: FontSize; label: string; scale: string }[] = [
    { value: "small", label: "Petit", scale: "A" },
    { value: "normal", label: "Normal", scale: "A" },
    { value: "large", label: "Grand", scale: "A" },
    { value: "xlarge", label: "Très grand", scale: "A" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`
          w-10 h-10 border-2 border-border bg-bg-secondary
          flex items-center justify-center
          transition-all duration-200
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          hover:shadow-[4px_4px_0_var(--border)]
        `}
        aria-label="Paramètres d'accessibilité"
        title="Accessibilité"
      >
        <span className="font-body font-bold text-text-primary">Aa</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-bg-secondary border-3 border-border shadow-brutal z-50">
            <div className="p-4">
              <h3 className="font-display text-lg text-text-primary mb-4">Accessibilité</h3>

              {/* Font size */}
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                  Taille du texte
                </label>
                <div className="flex gap-1">
                  {fontSizes.map((size, index) => (
                    <button
                      key={size.value}
                      onClick={() => setFontSize(size.value)}
                      className={`
                        flex-1 py-2 border-2 transition-all
                        ${fontSize === size.value
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-border-light bg-bg-tertiary text-text-muted hover:border-border"
                        }
                      `}
                      title={size.label}
                    >
                      <span
                        className="font-body font-bold"
                        style={{ fontSize: `${0.75 + index * 0.25}rem` }}
                      >
                        {size.scale}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contrast mode */}
              <div className="mb-4">
                <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                  Contraste
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setContrastMode("normal")}
                    className={`
                      flex-1 py-2 px-3 border-2 text-sm font-medium transition-all
                      ${contrastMode === "normal"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-light bg-bg-tertiary text-text-muted hover:border-border"
                      }
                    `}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setContrastMode("high")}
                    className={`
                      flex-1 py-2 px-3 border-2 text-sm font-medium transition-all
                      ${contrastMode === "high"
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border-light bg-bg-tertiary text-text-muted hover:border-border"
                      }
                    `}
                  >
                    Élevé
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="p-3 bg-bg-tertiary border border-border-light">
                <p className="text-sm text-text-body">
                  Aperçu du texte avec les paramètres actuels.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
