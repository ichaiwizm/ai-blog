"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface FavoriteItem {
  slug: string;
  type: "post" | "concept";
  addedAt: string; // ISO date
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (slug: string, type: "post" | "concept") => void;
  removeFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
  getFavoritesByType: (type: "post" | "concept") => FavoriteItem[];
  isLoaded: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "user-favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      } catch {
        setFavorites([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (items: FavoriteItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  };

  const addFavorite = (slug: string, type: "post" | "concept") => {
    setFavorites((prev) => {
      if (prev.some((f) => f.slug === slug)) return prev;
      const next = [...prev, { slug, type, addedAt: new Date().toISOString() }];
      saveToStorage(next);
      return next;
    });
  };

  const removeFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.slug !== slug);
      saveToStorage(next);
      return next;
    });
  };

  const isFavorite = (slug: string) => favorites.some((f) => f.slug === slug);

  const getFavoritesByType = (type: "post" | "concept") =>
    favorites.filter((f) => f.type === type);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        getFavoritesByType,
        isLoaded,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
