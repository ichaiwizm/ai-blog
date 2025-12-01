"use client";

import { useGamification } from "@/contexts/GamificationContext";
import { useEffect, useState } from "react";

interface StreakDisplayProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  showLongest?: boolean;
}

export default function StreakDisplay({
  size = "md",
  showLabel = true,
  showLongest = false,
}: StreakDisplayProps) {
  const { stats, isLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: {
      container: "gap-1.5",
      icon: "text-lg",
      number: "text-lg",
      label: "text-[10px]",
    },
    md: {
      container: "gap-2",
      icon: "text-2xl",
      number: "text-2xl",
      label: "text-xs",
    },
    lg: {
      container: "gap-3",
      icon: "text-4xl",
      number: "text-4xl",
      label: "text-sm",
    },
  };

  const classes = sizeClasses[size];

  if (!mounted || !isLoaded) {
    return (
      <div className={`flex items-center ${classes.container}`}>
        <div className={`${classes.icon} opacity-30`}>🔥</div>
        <div className="animate-pulse">
          <div className={`${classes.number} bg-bg-tertiary rounded w-8 h-6`} />
        </div>
      </div>
    );
  }

  const hasStreak = stats.currentStreak > 0;
  const isHot = stats.currentStreak >= 7;
  const isOnFire = stats.currentStreak >= 30;

  return (
    <div className={`flex items-center ${classes.container}`}>
      {/* Fire icon with animation */}
      <span
        className={`
          ${classes.icon}
          ${hasStreak ? "" : "grayscale opacity-50"}
          ${isHot ? "animate-pulse" : ""}
          ${isOnFire ? "animate-bounce" : ""}
        `}
      >
        {isOnFire ? "💎" : isHot ? "⚡" : "🔥"}
      </span>

      {/* Streak number */}
      <div className="flex flex-col">
        <span
          className={`
            font-mono font-bold ${classes.number}
            ${hasStreak ? "text-text-primary" : "text-text-muted"}
          `}
        >
          {stats.currentStreak}
        </span>
        {showLabel && (
          <span className={`${classes.label} uppercase tracking-wider text-text-muted`}>
            {stats.currentStreak === 1 ? "jour" : "jours"}
          </span>
        )}
      </div>

      {/* Longest streak */}
      {showLongest && stats.longestStreak > stats.currentStreak && (
        <div className="ml-2 pl-2 border-l border-border-light">
          <span className={`${classes.label} text-text-muted`}>
            Record: {stats.longestStreak}
          </span>
        </div>
      )}
    </div>
  );
}

// Mini version for header
export function StreakBadge() {
  const { stats, isLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded || stats.currentStreak === 0) return null;

  return (
    <div
      className="
        flex items-center gap-1 px-2 py-1
        bg-amber-50 dark:bg-amber-900/30
        border-2 border-amber-400/50
        text-sm
      "
      title={`Streak de ${stats.currentStreak} jours`}
    >
      <span>🔥</span>
      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
        {stats.currentStreak}
      </span>
    </div>
  );
}
