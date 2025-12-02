"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useGamification } from "@/contexts/GamificationContext";
import { UserIcon, DashboardIcon, HeartIcon, FlameIcon, LightningIcon, DiamondIcon } from "@/components/icons";

interface UserMenuProps {
  pathname: string;
}

export function UserMenu({ pathname }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { stats, currentLevel, isLoaded } = useGamification();
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

  if (!mounted || !isLoaded) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  const hasStreak = stats.currentStreak > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
        aria-label="Mon compte"
        title="Mon compte"
      >
        <UserIcon size={18} />
        {hasStreak && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-border text-[10px] font-mono font-bold flex items-center justify-center">
            {stats.currentStreak > 99 ? "99" : stats.currentStreak}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          {/* Streak Banner */}
          {hasStreak && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-b-3 border-border">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 dark:text-amber-400">
                  {stats.currentStreak >= 30 ? <DiamondIcon size={28} /> : stats.currentStreak >= 7 ? <LightningIcon size={28} /> : <FlameIcon size={28} />}
                </span>
                <div>
                  <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.currentStreak}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-text-muted">
                    jours consécutifs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 transition-colors
                ${pathname === "/dashboard" ? "bg-accent/10 text-accent" : "hover:bg-bg-tertiary text-text-primary"}
              `}
            >
              <DashboardIcon size={18} />
              <span className="font-body font-semibold text-sm">Dashboard</span>
            </Link>
            <Link
              href="/favoris"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 transition-colors
                ${pathname === "/favoris" ? "bg-accent/10 text-accent" : "hover:bg-bg-tertiary text-text-primary"}
              `}
            >
              <HeartIcon size={18} />
              <span className="font-body font-semibold text-sm">Mes favoris</span>
            </Link>
          </div>

          {/* Stats Footer */}
          <div className="p-3 border-t-2 border-border-light bg-bg-tertiary">
            <div className="flex justify-between text-xs font-mono text-text-muted">
              <span>XP: {stats.totalXP}</span>
              <span>Niveau {currentLevel.level}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
