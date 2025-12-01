"use client";

import { useGamification, BADGES, LEVELS, BadgeId } from "@/contexts/GamificationContext";
import { useConcepts } from "@/contexts/ConceptsContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { LEARNING_PATHS, calculatePathProgress } from "@/lib/learning-paths";
import Link from "next/link";
import { useEffect, useState } from "react";
import StreakDisplay from "@/components/StreakDisplay";
import UserLevelBadge from "@/components/UserLevelBadge";

export default function DashboardPage() {
  const { stats, unlockedBadges, currentLevel, nextLevel, xpProgress, isLoaded: gamificationLoaded } = useGamification();
  const { completedConcepts, isLoaded: conceptsLoaded } = useConcepts();
  const { favorites, isLoaded: favoritesLoaded } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoaded = mounted && gamificationLoaded && conceptsLoaded && favoritesLoaded;

  if (!isLoaded) {
    return (
      <div className="container-default py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-64 bg-bg-tertiary" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-bg-tertiary border-3 border-border-light" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate path progress for each learning path
  const pathsProgress = LEARNING_PATHS.map((path) => ({
    path,
    ...calculatePathProgress(path.id, completedConcepts, stats.articlesReadSlugs),
  }));

  return (
    <div className="container-default py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
          Mon Tableau de Bord
        </h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Suivez votre progression, débloquez des badges et atteignez vos objectifs d'apprentissage.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Level Card */}
        <div className="bg-bg-secondary border-3 border-border p-6 animate-fade-up stagger-1">
          <div className="text-xs uppercase tracking-wider text-text-muted mb-4">Niveau</div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent/10 border-2 border-accent flex items-center justify-center text-3xl">
              {currentLevel.icon}
            </div>
            <div>
              <div className="font-display text-2xl text-text-primary">
                {currentLevel.name}
              </div>
              <div className="text-sm text-text-muted">Niveau {currentLevel.level}</div>
            </div>
          </div>
          {nextLevel && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-text-muted mb-1">
                <span>{stats.totalXP} XP</span>
                <span>{nextLevel.xpRequired} XP</span>
              </div>
              <div className="h-2 bg-border-light overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Streak Card */}
        <div className="bg-bg-secondary border-3 border-border p-6 animate-fade-up stagger-2">
          <div className="text-xs uppercase tracking-wider text-text-muted mb-4">Streak</div>
          <StreakDisplay size="lg" showLongest />
          <p className="text-sm text-text-muted mt-4">
            {stats.currentStreak === 0
              ? "Commencez à lire pour démarrer votre streak !"
              : stats.currentStreak >= 7
              ? "Impressionnant ! Continuez comme ça !"
              : "Revenez demain pour maintenir votre streak !"}
          </p>
        </div>

        {/* Articles Read */}
        <div className="bg-bg-secondary border-3 border-border p-6 animate-fade-up stagger-3">
          <div className="text-xs uppercase tracking-wider text-text-muted mb-4">Articles Lus</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold text-text-primary">
              {stats.articlesRead}
            </span>
            <span className="text-lg text-text-muted">articles</span>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-2xl">📖</span>
            <span className="text-sm text-text-muted">
              +{10 * stats.articlesRead} XP gagnés en lecture
            </span>
          </div>
        </div>

        {/* Concepts Mastered */}
        <div className="bg-bg-secondary border-3 border-border p-6 animate-fade-up stagger-4">
          <div className="text-xs uppercase tracking-wider text-text-muted mb-4">Concepts Maîtrisés</div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-5xl font-bold text-text-primary">
              {completedConcepts.size}
            </span>
            <span className="text-lg text-text-muted">concepts</span>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-2xl">🧠</span>
            <span className="text-sm text-text-muted">
              {completedConcepts.size > 0 ? "Continuez à apprendre !" : "Explorez les concepts"}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="mb-12 animate-fade-up stagger-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-text-primary">Mes Badges</h2>
          <span className="text-sm text-text-muted">
            {unlockedBadges.length} / {Object.keys(BADGES).length} débloqués
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(BADGES).map(([id, badge]) => {
            const isUnlocked = unlockedBadges.includes(id as BadgeId);
            return (
              <div
                key={id}
                className={`
                  relative p-4 border-3 text-center
                  transition-all duration-200
                  ${isUnlocked
                    ? "bg-bg-secondary border-border hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal"
                    : "bg-bg-tertiary border-border-light opacity-50 grayscale"
                  }
                `}
                title={badge.description}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold text-text-primary truncate">
                  {badge.name}
                </div>
                <div className="text-xs text-text-muted mt-1 line-clamp-2">
                  {badge.description}
                </div>
                {isUnlocked && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 text-white text-xs flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Paths Progress */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-text-primary">Parcours d'Apprentissage</h2>
          <Link href="/parcours" className="text-sm text-accent hover:underline">
            Voir tous les parcours →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathsProgress.map(({ path, completed, total, percentage }) => (
            <Link
              key={path.id}
              href={`/parcours/${path.id}`}
              className="group bg-bg-secondary border-3 border-border p-6 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 border-2 border-accent flex items-center justify-center text-2xl shrink-0">
                  {path.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-1 line-clamp-2">
                    {path.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>{completed} / {total} étapes</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-2 bg-border-light overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      percentage === 100 ? "bg-emerald-500" : "bg-accent"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {percentage === 100 && (
                <div className="mt-3 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                  <span>✓</span> Parcours complété !
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div className="animate-fade-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-text-primary">Mes Favoris</h2>
            <Link href="/favoris" className="text-sm text-accent hover:underline">
              Voir tous →
            </Link>
          </div>

          <div className="bg-bg-secondary border-3 border-border p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">♥</div>
              <div>
                <div className="font-mono text-2xl font-bold text-text-primary">
                  {favorites.length}
                </div>
                <div className="text-sm text-text-muted">
                  éléments sauvegardés
                </div>
              </div>
              <Link
                href="/favoris"
                className="ml-auto brutal-btn-secondary text-sm"
              >
                Voir ma liste →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* XP History - Level progression */}
      <div className="mt-12 animate-fade-up">
        <h2 className="font-display text-2xl text-text-primary mb-6">Progression des Niveaux</h2>
        <div className="bg-bg-secondary border-3 border-border p-6">
          <div className="flex flex-wrap gap-3">
            {LEVELS.map((level) => (
              <div
                key={level.level}
                className={`
                  flex items-center gap-2 px-3 py-2 border-2
                  ${stats.totalXP >= level.xpRequired
                    ? "border-accent bg-accent/10"
                    : "border-border-light bg-bg-tertiary opacity-50"
                  }
                `}
              >
                <span className="text-xl">{level.icon}</span>
                <div>
                  <div className="text-xs font-semibold">{level.name}</div>
                  <div className="text-[10px] text-text-muted">{level.xpRequired} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
