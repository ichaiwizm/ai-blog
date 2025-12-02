"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from "react";

// Badge definitions
export const BADGES = {
  first_article: {
    id: "first_article",
    name: "Premier Pas",
    description: "Lire votre premier article",
    icon: "book-open",
    condition: (stats: UserStats) => stats.articlesRead >= 1,
  },
  five_articles: {
    id: "five_articles",
    name: "Lecteur Assidu",
    description: "Lire 5 articles",
    icon: "books",
    condition: (stats: UserStats) => stats.articlesRead >= 5,
  },
  ten_articles: {
    id: "ten_articles",
    name: "Bibliophile",
    description: "Lire 10 articles",
    icon: "trophy",
    condition: (stats: UserStats) => stats.articlesRead >= 10,
  },
  first_concept: {
    id: "first_concept",
    name: "Apprenti",
    description: "Maîtriser votre premier concept",
    icon: "target",
    condition: (stats: UserStats) => stats.conceptsMastered >= 1,
  },
  five_concepts: {
    id: "five_concepts",
    name: "Érudit",
    description: "Maîtriser 5 concepts",
    icon: "brain",
    condition: (stats: UserStats) => stats.conceptsMastered >= 5,
  },
  all_concepts: {
    id: "all_concepts",
    name: "Maître",
    description: "Maîtriser tous les concepts",
    icon: "crown",
    condition: (stats: UserStats) => stats.conceptsMastered >= stats.totalConcepts && stats.totalConcepts > 0,
  },
  first_path: {
    id: "first_path",
    name: "Explorateur",
    description: "Compléter un parcours guidé",
    icon: "map",
    condition: (stats: UserStats) => stats.pathsCompleted >= 1,
  },
  three_paths: {
    id: "three_paths",
    name: "Aventurier",
    description: "Compléter 3 parcours",
    icon: "compass",
    condition: (stats: UserStats) => stats.pathsCompleted >= 3,
  },
  streak_3: {
    id: "streak_3",
    name: "Régulier",
    description: "Streak de 3 jours",
    icon: "flame",
    condition: (stats: UserStats) => stats.currentStreak >= 3,
  },
  streak_7: {
    id: "streak_7",
    name: "Dévoué",
    description: "Streak de 7 jours",
    icon: "lightning",
    condition: (stats: UserStats) => stats.currentStreak >= 7,
  },
  streak_30: {
    id: "streak_30",
    name: "Légendaire",
    description: "Streak de 30 jours",
    icon: "diamond",
    condition: (stats: UserStats) => stats.currentStreak >= 30,
  },
  night_owl: {
    id: "night_owl",
    name: "Noctambule",
    description: "Lire un article après minuit",
    icon: "owl",
    condition: (stats: UserStats) => stats.nightOwl,
  },
  early_bird: {
    id: "early_bird",
    name: "Lève-tôt",
    description: "Lire un article avant 7h du matin",
    icon: "bird",
    condition: (stats: UserStats) => stats.earlyBird,
  },
} as const;

export type BadgeId = keyof typeof BADGES;

// Level definitions
export const LEVELS = [
  { level: 1, name: "Novice", xpRequired: 0, icon: "seedling" },
  { level: 2, name: "Débutant", xpRequired: 50, icon: "plant" },
  { level: 3, name: "Apprenti", xpRequired: 150, icon: "tree" },
  { level: 4, name: "Intermédiaire", xpRequired: 300, icon: "star" },
  { level: 5, name: "Avancé", xpRequired: 500, icon: "star-filled" },
  { level: 6, name: "Expert", xpRequired: 800, icon: "sparkles" },
  { level: 7, name: "Maître", xpRequired: 1200, icon: "medal" },
  { level: 8, name: "Grand Maître", xpRequired: 1800, icon: "award" },
  { level: 9, name: "Légende", xpRequired: 2500, icon: "crown" },
  { level: 10, name: "Transcendant", xpRequired: 3500, icon: "sparkles" },
] as const;

// XP rewards
export const XP_REWARDS = {
  readArticle: 10,
  masterConcept: 25,
  completePath: 100,
  dailyStreak: 5,
  unlockBadge: 15,
} as const;

export interface UserStats {
  articlesRead: number;
  articlesReadSlugs: string[];
  conceptsMastered: number;
  conceptsMasteredSlugs: string[];
  totalConcepts: number;
  pathsCompleted: number;
  pathsCompletedIds: string[];
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalXP: number;
  nightOwl: boolean;
  earlyBird: boolean;
}

interface GamificationContextType {
  stats: UserStats;
  unlockedBadges: BadgeId[];
  newBadges: BadgeId[];
  clearNewBadges: () => void;
  currentLevel: typeof LEVELS[number];
  nextLevel: typeof LEVELS[number] | null;
  xpProgress: number;
  recordArticleRead: (slug: string) => void;
  recordConceptMastered: (slug: string, totalConcepts: number) => void;
  recordPathCompleted: (pathId: string) => void;
  isLoaded: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "user-gamification";

const initialStats: UserStats = {
  articlesRead: 0,
  articlesReadSlugs: [],
  conceptsMastered: 0,
  conceptsMasteredSlugs: [],
  totalConcepts: 0,
  pathsCompleted: 0,
  pathsCompletedIds: [],
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  totalXP: 0,
  nightOwl: false,
  earlyBird: false,
};

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>([]);
  const [newBadges, setNewBadges] = useState<BadgeId[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const unlockedBadgesRef = useRef<BadgeId[]>([]);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const loadedStats = { ...initialStats, ...parsed.stats };
        const loadedBadges = parsed.unlockedBadges || [];
        setStats(loadedStats);
        setUnlockedBadges(loadedBadges);
        unlockedBadgesRef.current = loadedBadges;
      } catch (error) {
        console.warn("Failed to parse gamification data:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    unlockedBadgesRef.current = unlockedBadges;
  }, [unlockedBadges]);

  const saveToStorage = useCallback((newStats: UserStats, badges: BadgeId[]) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stats: newStats, unlockedBadges: badges })
    );
  }, []);

  const checkBadges = useCallback((newStats: UserStats, currentBadges: BadgeId[]): BadgeId[] => {
    const newlyUnlocked: BadgeId[] = [];
    Object.entries(BADGES).forEach(([id, badge]) => {
      const badgeId = id as BadgeId;
      if (!currentBadges.includes(badgeId) && badge.condition(newStats)) {
        newlyUnlocked.push(badgeId);
      }
    });
    return newlyUnlocked;
  }, []);

  const updateStreak = useCallback((currentStats: UserStats): UserStats => {
    const today = new Date().toISOString().split("T")[0];
    const lastActivity = currentStats.lastActivityDate;

    if (!lastActivity) {
      return { ...currentStats, currentStreak: 1, lastActivityDate: today };
    }

    const lastDate = new Date(lastActivity);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      return currentStats;
    } else if (diffDays === 1) {
      const newStreak = currentStats.currentStreak + 1;
      return {
        ...currentStats,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStats.longestStreak),
        lastActivityDate: today,
        totalXP: currentStats.totalXP + XP_REWARDS.dailyStreak,
      };
    } else {
      return { ...currentStats, currentStreak: 1, lastActivityDate: today };
    }
  }, []);

  const checkTimeBadges = useCallback((currentStats: UserStats): UserStats => {
    const hour = new Date().getHours();
    let updated = { ...currentStats };

    if (hour >= 0 && hour < 5 && !currentStats.nightOwl) {
      updated = { ...updated, nightOwl: true };
    }
    if (hour >= 5 && hour < 7 && !currentStats.earlyBird) {
      updated = { ...updated, earlyBird: true };
    }

    return updated;
  }, []);

  // Generic record function to reduce duplication
  const recordActivity = useCallback(<T extends keyof UserStats>(
    key: T,
    slug: string,
    slugsKey: keyof UserStats,
    xpReward: number,
    extraUpdates?: Partial<UserStats>
  ) => {
    setStats((prev) => {
      const slugsArray = prev[slugsKey] as string[];
      if (slugsArray.includes(slug)) return prev;

      let newStats: UserStats = {
        ...prev,
        [key]: (prev[key] as number) + 1,
        [slugsKey]: [...slugsArray, slug],
        totalXP: prev.totalXP + xpReward,
        ...extraUpdates,
      };

      newStats = updateStreak(newStats);
      newStats = checkTimeBadges(newStats);

      const currentBadges = unlockedBadgesRef.current;
      const newlyUnlocked = checkBadges(newStats, currentBadges);

      if (newlyUnlocked.length > 0) {
        const updatedBadges = [...currentBadges, ...newlyUnlocked];
        setUnlockedBadges(updatedBadges);
        unlockedBadgesRef.current = updatedBadges;
        setNewBadges((prevBadges) => [...prevBadges, ...newlyUnlocked]);
        newStats.totalXP += newlyUnlocked.length * XP_REWARDS.unlockBadge;
        saveToStorage(newStats, updatedBadges);
      } else {
        saveToStorage(newStats, currentBadges);
      }

      return newStats;
    });
  }, [updateStreak, checkTimeBadges, checkBadges, saveToStorage]);

  const recordArticleRead = useCallback((slug: string) => {
    recordActivity("articlesRead", slug, "articlesReadSlugs", XP_REWARDS.readArticle);
  }, [recordActivity]);

  const recordConceptMastered = useCallback((slug: string, totalConcepts: number) => {
    recordActivity("conceptsMastered", slug, "conceptsMasteredSlugs", XP_REWARDS.masterConcept, { totalConcepts });
  }, [recordActivity]);

  const recordPathCompleted = useCallback((pathId: string) => {
    recordActivity("pathsCompleted", pathId, "pathsCompletedIds", XP_REWARDS.completePath);
  }, [recordActivity]);

  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  const currentLevel = LEVELS.reduce((acc, level) => {
    if (stats.totalXP >= level.xpRequired) return level;
    return acc;
  }, LEVELS[0]);

  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1) || null;

  const xpProgress = nextLevel
    ? ((stats.totalXP - currentLevel.xpRequired) /
        (nextLevel.xpRequired - currentLevel.xpRequired)) *
      100
    : 100;

  return (
    <GamificationContext.Provider
      value={{
        stats,
        unlockedBadges,
        newBadges,
        clearNewBadges,
        currentLevel,
        nextLevel,
        xpProgress,
        recordArticleRead,
        recordConceptMastered,
        recordPathCompleted,
        isLoaded,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error("useGamification must be used within a GamificationProvider");
  }
  return context;
}
