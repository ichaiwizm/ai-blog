"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  slug: string;
  type: "post" | "concept";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function FavoriteButton({
  slug,
  type,
  size = "md",
  showLabel = false,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite, isLoaded } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorite = mounted && isLoaded ? isFavorite(slug) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (favorite) {
      removeFavorite(slug);
    } else {
      addFavorite(slug, type);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (!mounted) {
    return (
      <button
        className={`${sizeClasses[size]} border-2 border-border bg-bg-secondary flex items-center justify-center ${className}`}
        disabled
      >
        <span className="opacity-30">♡</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`
        group relative flex items-center gap-2
        ${showLabel ? "px-4 py-2" : sizeClasses[size]}
        border-2 border-border bg-bg-secondary
        transition-all duration-200
        hover:translate-x-[-2px] hover:translate-y-[-2px]
        hover:shadow-[4px_4px_0_var(--border)]
        active:translate-x-0 active:translate-y-0 active:shadow-none
        ${favorite ? "bg-rose-50 dark:bg-rose-950 border-rose-400" : ""}
        ${className}
      `}
      aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      title={favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <span
        className={`
          transition-transform duration-300
          ${isAnimating ? "scale-125" : "scale-100"}
          ${favorite ? "text-rose-500" : "text-text-muted group-hover:text-rose-400"}
        `}
      >
        {favorite ? "♥" : "♡"}
      </span>
      {showLabel && (
        <span className={`font-medium ${labelSizeClasses[size]} ${favorite ? "text-rose-600 dark:text-rose-400" : "text-text-muted"}`}>
          {favorite ? "Sauvegardé" : "Sauvegarder"}
        </span>
      )}

      {/* Particle effect on favorite */}
      {isAnimating && favorite && (
        <span className="absolute inset-0 pointer-events-none">
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping text-rose-400 text-2xl">
            ♥
          </span>
        </span>
      )}
    </button>
  );
}
