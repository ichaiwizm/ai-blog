"use client";

import { useGamification } from "@/contexts/GamificationContext";
import { useEffect, useState } from "react";
import { FlameIcon, LightningIcon, DiamondIcon } from "@/components/icons";

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

  const sizeConfig = {
    sm: { iconSize: 18, container: "gap-1.5", number: "text-lg", label: "text-[10px]" },
    md: { iconSize: 24, container: "gap-2", number: "text-2xl", label: "text-xs" },
    lg: { iconSize: 36, container: "gap-3", number: "text-4xl", label: "text-sm" },
  };

  const config = sizeConfig[size];

  if (!mounted || !isLoaded) {
    return (
      <div className={`flex items-center ${config.container}`}>
        <div className="opacity-30 text-amber-500">
          <FlameIcon size={config.iconSize} />
        </div>
        <div className="animate-pulse">
          <div className={`${config.number} bg-bg-tertiary rounded w-8 h-6`} />
        </div>
      </div>
    );
  }

  const hasStreak = stats.currentStreak > 0;
  const isHot = stats.currentStreak >= 7;
  const isOnFire = stats.currentStreak >= 30;

  const getIcon = () => {
    if (isOnFire) return <DiamondIcon size={config.iconSize} />;
    if (isHot) return <LightningIcon size={config.iconSize} />;
    return <FlameIcon size={config.iconSize} />;
  };

  return (
    <div className={`flex items-center ${config.container}`}>
      {/* Fire icon with animation */}
      <span
        className={`
          text-amber-500 dark:text-amber-400
          ${hasStreak ? "" : "grayscale opacity-50"}
          ${isHot ? "animate-pulse" : ""}
          ${isOnFire ? "animate-bounce" : ""}
        `}
      >
        {getIcon()}
      </span>

      {/* Streak number */}
      <div className="flex flex-col">
        <span
          className={`
            font-mono font-bold ${config.number}
            ${hasStreak ? "text-text-primary" : "text-text-muted"}
          `}
        >
          {stats.currentStreak}
        </span>
        {showLabel && (
          <span className={`${config.label} uppercase tracking-wider text-text-muted`}>
            {stats.currentStreak === 1 ? "jour" : "jours"}
          </span>
        )}
      </div>

      {/* Longest streak */}
      {showLongest && stats.longestStreak > stats.currentStreak && (
        <div className="ml-2 pl-2 border-l border-border-light">
          <span className={`${config.label} text-text-muted`}>
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
      <span className="text-amber-500 dark:text-amber-400">
        <FlameIcon size={16} />
      </span>
      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
        {stats.currentStreak}
      </span>
    </div>
  );
}
