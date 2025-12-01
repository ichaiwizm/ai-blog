"use client";

import { useState, useRef, useEffect } from "react";
import { usePlatform, Platform, PLATFORMS } from "@/contexts/PlatformContext";

export default function PlatformSelector() {
  const { platform, setPlatform, isLoaded } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary animate-pulse" />
    );
  }

  const current = PLATFORMS[platform];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-3 flex items-center gap-2 border-2 border-border bg-bg-secondary text-text-muted hover:bg-accent hover:text-text-inverse hover:border-border transition-all font-mono text-sm"
        aria-label={`Plateforme: ${current.label}`}
        title="Changer de plateforme"
      >
        <span className="text-base">{current.icon}</span>
        <span className="hidden sm:inline font-medium">{current.label}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-bg-secondary border-3 border-border shadow-brutal z-50 animate-scale-up origin-top-right">
          <div className="p-2 border-b-2 border-border-light">
            <p className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Ma plateforme
            </p>
          </div>
          <div className="py-1">
            {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(
              ([key, value]) => (
                <button
                  key={key}
                  onClick={() => {
                    setPlatform(key);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all ${
                    platform === key
                      ? "bg-accent text-text-inverse"
                      : "hover:bg-bg-tertiary text-text-primary"
                  }`}
                >
                  <span className="text-xl">{value.icon}</span>
                  <div className="text-left">
                    <p className="font-body font-semibold text-sm">{value.label}</p>
                    <p
                      className={`font-mono text-xs ${
                        platform === key ? "text-text-inverse/70" : "text-text-muted"
                      }`}
                    >
                      {value.description}
                    </p>
                  </div>
                  {platform === key && (
                    <svg
                      className="ml-auto"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              )
            )}
          </div>
          <div className="p-3 border-t-2 border-border-light bg-bg-tertiary">
            <p className="font-mono text-xs text-text-muted leading-relaxed">
              Les instructions s'adaptent automatiquement à ta plateforme
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
