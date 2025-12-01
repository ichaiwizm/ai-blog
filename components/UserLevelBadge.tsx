"use client";

import { useGamification } from "@/contexts/GamificationContext";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserLevelBadgeProps {
  showXP?: boolean;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
  linkToDashboard?: boolean;
}

export default function UserLevelBadge({
  showXP = false,
  showProgress = true,
  size = "md",
  linkToDashboard = true,
}: UserLevelBadgeProps) {
  const { currentLevel, nextLevel, xpProgress, stats, isLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: {
      container: "gap-2",
      icon: "w-8 h-8 text-lg",
      text: "text-xs",
      progress: "h-1",
    },
    md: {
      container: "gap-3",
      icon: "w-10 h-10 text-xl",
      text: "text-sm",
      progress: "h-1.5",
    },
    lg: {
      container: "gap-4",
      icon: "w-14 h-14 text-2xl",
      text: "text-base",
      progress: "h-2",
    },
  };

  const classes = sizeClasses[size];

  if (!mounted || !isLoaded) {
    return (
      <div className={`flex items-center ${classes.container}`}>
        <div className={`${classes.icon} bg-bg-tertiary border-2 border-border-light animate-pulse`} />
        <div className="flex-1">
          <div className="h-4 w-20 bg-bg-tertiary animate-pulse rounded" />
        </div>
      </div>
    );
  }

  const content = (
    <div
      className={`
        flex items-center ${classes.container}
        ${linkToDashboard ? "group cursor-pointer" : ""}
      `}
    >
      {/* Level icon */}
      <div
        className={`
          ${classes.icon}
          bg-accent/10 border-2 border-accent
          flex items-center justify-center
          transition-all duration-200
          ${linkToDashboard ? "group-hover:scale-110 group-hover:shadow-brutal-sm" : ""}
        `}
      >
        <span>{currentLevel.icon}</span>
      </div>

      {/* Level info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className={`font-semibold text-text-primary ${classes.text}`}>
            Niv. {currentLevel.level}
          </span>
          <span className={`text-text-muted ${classes.text}`}>
            {currentLevel.name}
          </span>
        </div>

        {showXP && (
          <div className={`font-mono ${classes.text} text-accent`}>
            {stats.totalXP} XP
          </div>
        )}

        {showProgress && nextLevel && (
          <div className="mt-1">
            <div className={`w-full bg-border-light ${classes.progress} overflow-hidden`}>
              <div
                className={`${classes.progress} bg-accent transition-all duration-500`}
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className={`flex justify-between mt-0.5 ${classes.text} text-text-muted`}>
              <span>{stats.totalXP - currentLevel.xpRequired} / {nextLevel.xpRequired - currentLevel.xpRequired}</span>
              <span>→ Niv. {nextLevel.level}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (linkToDashboard) {
    return (
      <Link href="/dashboard" className="block">
        {content}
      </Link>
    );
  }

  return content;
}
