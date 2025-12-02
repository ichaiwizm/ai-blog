"use client";

import { useGamification, BADGES, BadgeId } from "@/contexts/GamificationContext";
import { useEffect, useState } from "react";
import { IconByName, SparklesIcon, TrophyIcon } from "@/components/icons";

export default function BadgeNotification() {
  const { newBadges, clearNewBadges } = useGamification();
  const [currentBadge, setCurrentBadge] = useState<BadgeId | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (newBadges.length > 0 && !currentBadge) {
      const badge = newBadges[0];
      setCurrentBadge(badge);
      setIsVisible(true);

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newBadges, currentBadge]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentBadge(null);
      clearNewBadges();
    }, 300);
  };

  if (!currentBadge) return null;

  const badge = BADGES[currentBadge];

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transition-all duration-300 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      `}
    >
      <div className="relative bg-bg-secondary border-3 border-border shadow-brutal p-6 max-w-sm">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          aria-label="Fermer"
        >
          <CloseIcon size={16} />
        </button>

        {/* Confetti effect - decorative icons */}
        <div className="absolute -top-2 -left-2 text-amber-500 animate-bounce">
          <TrophyIcon size={24} />
        </div>
        <div className="absolute -top-2 -right-8 text-amber-500 animate-bounce" style={{ animationDelay: "0.1s" }}>
          <SparklesIcon size={24} />
        </div>

        {/* Content */}
        <div className="flex items-start gap-4">
          {/* Badge icon */}
          <div className="w-16 h-16 bg-accent/10 border-2 border-accent flex items-center justify-center text-accent shrink-0">
            <IconByName name={badge.icon} size={32} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono uppercase tracking-wider text-accent mb-1">
              Nouveau Badge Débloqué !
            </p>
            <h3 className="font-display text-xl text-text-primary mb-1">
              {badge.name}
            </h3>
            <p className="text-sm text-text-muted">
              {badge.description}
            </p>
          </div>
        </div>

        {/* XP bonus */}
        <div className="mt-4 pt-3 border-t border-border-light flex items-center justify-between">
          <span className="text-xs text-text-muted">Bonus</span>
          <span className="font-mono text-sm font-bold text-accent">+15 XP</span>
        </div>

        {/* Progress bar animation */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border-light overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-[5000ms] ease-linear"
            style={{ width: isVisible ? "0%" : "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
