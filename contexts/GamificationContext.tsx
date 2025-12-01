"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

// Badge definitions
export const BADGES = {
  first_article: {
    id: "first_article",
    name: "Premier Pas",
    description: "Lire votre premier article",
    icon: "📖",
    condition: (stats: UserStats) => stats.articlesRead >= 1,
  },
  five_articles: {
    id: "five_articles",
    name: "Lecteur Assidu",
    description: "Lire 5 articles",
    icon: "📚",
    condition: (stats: UserStats) => stats.articlesRead >= 5,
  },
  ten_articles: {
    id: "ten_articles",
    name: "Bibliophile",
    description: "Lire 10 articles",
    icon: "🏆",
    condition: (stats: UserStats) => stats.articlesRead >= 10,
  },
  first_concept: {
    id: "first_concept",
    name: "Apprenti",
    description: "Maîtriser votre premier concept",
    icon: "🎯",
    condition: (stats: UserStats) => stats.conceptsMastered >= 1,
  },
  five_concepts: {
    id: "five_concepts",
    name: "Érudit",
    description: "Maîtriser 5 concepts",
    icon: "🧠",
    condition: (stats: UserStats) => stats.conceptsMastered >= 5,
  },
  all_concepts: {
    id: "all_concepts",
    name: "Maître",
    description: "Maîtriser tous les concepts",
    icon: "👑",
    condition: (stats: UserStats) => stats.conceptsMastered >= stats.totalConcepts && stats.totalConcepts > 0,
  },
  first_series: {
    id: "first_series",
    name: "Marathonien",
    description: "Compléter une série d'articles",
    icon: "🏃",
    condition: (stats: UserStats) => stats.seriesCompleted >= 1,
  },
  streak_3: {
    id: "streak_3",
    name: "Régulier",
    description: "Streak de 3 jours",
    icon: "🔥",
    condition: (stats: UserStats) => stats.currentStreak >= 3,
  },
  streak_7: {
    id: "streak_7",
    name: "Dévoué",
    description: "Streak de 7 jours",
    icon: "⚡",
    condition: (stats: UserStats) => stats.currentStreak >= 7,
  },
  streak_30: {
    id: "streak_30",
    name: "Légendaire",
    description: "Streak de 30 jours",
    icon: "💎",
    condition: (stats: UserStats) => stats.currentStreak >= 30,
  },
  first_path: {
    id: "first_path",
    name: "Explorateur",
    description: "Compléter un parcours guidé",
    icon: "🗺️",
    condition: (stats: UserStats) => stats.pathsCompleted >= 1,
  },
  night_owl: {
    id: "night_owl",
    name: "Noctambule",
    description: "Lire un article après minuit",
    icon: "🦉",
    condition: (stats: UserStats) => stats.nightOwl,
  },
  early_bird: {
    id: "early_bird",
    name: "Lève-tôt",
    description: "Lire un article avant 7h du matin",
    icon: "🐦",
    condition: (stats: UserStats) => stats.earlyBird,
  },
} as const;

export type BadgeId = keyof typeof BADGES;

// Level definitions
export const LEVELS = [
  { level: 1, name: "Novice", xpRequired: 0, icon: "🌱" },
  { level: 2, name: "Débutant", xpRequired: 50, icon: "🌿" },
  { level: 3, name: "Apprenti", xpRequired: 150, icon: "🌳" },
  { level: 4, name: "Intermédiaire", xpRequired: 300, icon: "⭐" },
  { level: 5, name: "Avancé", xpRequired: 500, icon: "🌟" },
  { level: 6, name: "Expert", xpRequired: 800, icon: "💫" },
  { level: 7, name: "Maître", xpRequired: 1200, icon: "🏅" },
  { level: 8, name: "Grand Maître", xpRequired: 1800, icon: "🎖️" },
  { level: 9, name: "Légende", xpRequired: 2500, icon: "👑" },
  { level: 10, name: "Transcendant", xpRequired: 3500, icon: "✨" },
] as const;

// XP rewards
export const XP_REWARDS = {
  readArticle: 10,
  masterConcept: 25,
  completeSeries: 50,
  completePath: 100,
  dailyStreak: 5,
  unlockBadge: 15,
} as const;

export interface UserStats {
  articlesRead: number;
  articlesReadSlugs: string[];
  conceptsMastered: number;
  totalConcepts: number;
  seriesCompleted: number;
  seriesCompletedIds: string[];
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
  newBadges: BadgeId[]; // Recently unlocked, for notifications
  clearNewBadges: () => void;
  currentLevel: typeof LEVELS[number];
  nextLevel: typeof LEVELS[number] | null;
  xpProgress: number; // 0-100 percentage to next level
  recordArticleRead: (slug: string) => void;
  recordConceptMastered: (totalConcepts: number) => void;
  recordSeriesCompleted: (seriesId: string) => void;
  recordPathCompleted: (pathId: string) => void;
  isLoaded: boolean;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "user-gamification";

const initialStats: UserStats = {
  articlesRead: 0,
  articlesReadSlugs: [],
  conceptsMastered: 0,
  totalConcepts: 0,
  seriesCompleted: 0,
  seriesCompletedIds: [],
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

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStats(parsed.stats || initialStats);
        setUnlockedBadges(parsed.unlockedBadges || []);
      } catch {
        // Invalid data
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((newStats: UserStats, badges: BadgeId[]) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ stats: newStats, unlockedBadges: badges })
    );
  }, []);

  // Check for new badges
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

  // Update streak based on last activity
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
      // Same day, no change
      return currentStats;
    } else if (diffDays === 1) {
      // Next day, increment streak
      const newStreak = currentStats.currentStreak + 1;
      return {
        ...currentStats,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStats.longestStreak),
        lastActivityDate: today,
        totalXP: currentStats.totalXP + XP_REWARDS.dailyStreak,
      };
    } else {
      // Streak broken
      return { ...currentStats, currentStreak: 1, lastActivityDate: today };
    }
  }, []);

  // Check time-based badges
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

  const recordArticleRead = useCallback((slug: string) => {
    setStats((prev) => {
      if (prev.articlesReadSlugs.includes(slug)) return prev;

      let newStats = {
        ...prev,
        articlesRead: prev.articlesRead + 1,
        articlesReadSlugs: [...prev.articlesReadSlugs, slug],
        totalXP: prev.totalXP + XP_REWARDS.readArticle,
      };

      newStats = updateStreak(newStats);
      newStats = checkTimeBadges(newStats);

      const newlyUnlocked = checkBadges(newStats, unlockedBadges);
      if (newlyUnlocked.length > 0) {
        const updatedBadges = [...unlockedBadges, ...newlyUnlocked];
        setUnlockedBadges(updatedBadges);
        setNewBadges((prev) => [...prev, ...newlyUnlocked]);
        newStats.totalXP += newlyUnlocked.length * XP_REWARDS.unlockBadge;
        saveToStorage(newStats, updatedBadges);
      } else {
        saveToStorage(newStats, unlockedBadges);
      }

      return newStats;
    });
  }, [unlockedBadges, updateStreak, checkTimeBadges, checkBadges, saveToStorage]);

  const recordConceptMastered = useCallback((totalConcepts: number) => {
    setStats((prev) => {
      let newStats = {
        ...prev,
        conceptsMastered: prev.conceptsMastered + 1,
        totalConcepts,
        totalXP: prev.totalXP + XP_REWARDS.masterConcept,
      };

      newStats = updateStreak(newStats);

      const newlyUnlocked = checkBadges(newStats, unlockedBadges);
      if (newlyUnlocked.length > 0) {
        const updatedBadges = [...unlockedBadges, ...newlyUnlocked];
        setUnlockedBadges(updatedBadges);
        setNewBadges((prev) => [...prev, ...newlyUnlocked]);
        newStats.totalXP += newlyUnlocked.length * XP_REWARDS.unlockBadge;
        saveToStorage(newStats, updatedBadges);
      } else {
        saveToStorage(newStats, unlockedBadges);
      }

      return newStats;
    });
  }, [unlockedBadges, updateStreak, checkBadges, saveToStorage]);

  const recordSeriesCompleted = useCallback((seriesId: string) => {
    setStats((prev) => {
      if (prev.seriesCompletedIds.includes(seriesId)) return prev;

      let newStats = {
        ...prev,
        seriesCompleted: prev.seriesCompleted + 1,
        seriesCompletedIds: [...prev.seriesCompletedIds, seriesId],
        totalXP: prev.totalXP + XP_REWARDS.completeSeries,
      };

      newStats = updateStreak(newStats);

      const newlyUnlocked = checkBadges(newStats, unlockedBadges);
      if (newlyUnlocked.length > 0) {
        const updatedBadges = [...unlockedBadges, ...newlyUnlocked];
        setUnlockedBadges(updatedBadges);
        setNewBadges((prev) => [...prev, ...newlyUnlocked]);
        newStats.totalXP += newlyUnlocked.length * XP_REWARDS.unlockBadge;
        saveToStorage(newStats, updatedBadges);
      } else {
        saveToStorage(newStats, unlockedBadges);
      }

      return newStats;
    });
  }, [unlockedBadges, updateStreak, checkBadges, saveToStorage]);

  const recordPathCompleted = useCallback((pathId: string) => {
    setStats((prev) => {
      if (prev.pathsCompletedIds.includes(pathId)) return prev;

      let newStats = {
        ...prev,
        pathsCompleted: prev.pathsCompleted + 1,
        pathsCompletedIds: [...prev.pathsCompletedIds, pathId],
        totalXP: prev.totalXP + XP_REWARDS.completePath,
      };

      newStats = updateStreak(newStats);

      const newlyUnlocked = checkBadges(newStats, unlockedBadges);
      if (newlyUnlocked.length > 0) {
        const updatedBadges = [...unlockedBadges, ...newlyUnlocked];
        setUnlockedBadges(updatedBadges);
        setNewBadges((prev) => [...prev, ...newlyUnlocked]);
        newStats.totalXP += newlyUnlocked.length * XP_REWARDS.unlockBadge;
        saveToStorage(newStats, updatedBadges);
      } else {
        saveToStorage(newStats, unlockedBadges);
      }

      return newStats;
    });
  }, [unlockedBadges, updateStreak, checkBadges, saveToStorage]);

  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  // Calculate current level
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
        recordSeriesCompleted,
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
