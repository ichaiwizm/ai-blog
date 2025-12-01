"use client";

import { LEARNING_PATHS, calculatePathProgress, LearningPath } from "@/lib/learning-paths";
import { useConcepts } from "@/contexts/ConceptsContext";
import { useGamification } from "@/contexts/GamificationContext";
import Link from "next/link";
import { useEffect, useState } from "react";

const levelColors = {
  debutant: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-400",
  intermediaire: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-400",
  avance: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-400",
};

const levelLabels = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export default function ParcoursPage() {
  const { completedConcepts, isLoaded: conceptsLoaded } = useConcepts();
  const { stats, isLoaded: gamificationLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoaded = mounted && conceptsLoaded && gamificationLoaded;

  // Group paths by level
  const pathsByLevel = LEARNING_PATHS.reduce((acc, path) => {
    if (!acc[path.level]) acc[path.level] = [];
    acc[path.level].push(path);
    return acc;
  }, {} as Record<LearningPath["level"], LearningPath[]>);

  return (
    <div className="container-default py-12">
      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-mono uppercase tracking-wider mb-4">
          Parcours Guidés
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
          Apprenez étape par étape
        </h1>
        <p className="text-lg text-text-muted max-w-2xl">
          Suivez nos parcours d'apprentissage structurés pour maîtriser l'IA et le développement.
          Chaque parcours combine concepts et articles pratiques.
        </p>
      </div>

      {/* Stats */}
      {isLoaded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 animate-fade-up stagger-1">
          <div className="bg-bg-secondary border-3 border-border p-4">
            <div className="text-3xl font-mono font-bold text-text-primary">
              {LEARNING_PATHS.length}
            </div>
            <div className="text-sm text-text-muted">Parcours disponibles</div>
          </div>
          <div className="bg-bg-secondary border-3 border-border p-4">
            <div className="text-3xl font-mono font-bold text-text-primary">
              {stats.pathsCompleted}
            </div>
            <div className="text-sm text-text-muted">Parcours complétés</div>
          </div>
          <div className="bg-bg-secondary border-3 border-border p-4">
            <div className="text-3xl font-mono font-bold text-accent">
              +100 XP
            </div>
            <div className="text-sm text-text-muted">Par parcours terminé</div>
          </div>
        </div>
      )}

      {/* Paths by Level */}
      {(["debutant", "intermediaire", "avance"] as const).map((level) => {
        const paths = pathsByLevel[level];
        if (!paths || paths.length === 0) return null;

        return (
          <div key={level} className="mb-12 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="font-display text-2xl text-text-primary">
                {levelLabels[level]}
              </h2>
              <span className={`px-2 py-0.5 text-xs font-mono uppercase border-2 ${levelColors[level]}`}>
                {paths.length} parcours
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paths.map((path) => {
                const progress = isLoaded
                  ? calculatePathProgress(path.id, completedConcepts, stats.articlesReadSlugs)
                  : { completed: 0, total: path.steps.length, percentage: 0 };

                const isCompleted = progress.percentage === 100;
                const hasPrerequisites = path.prerequisites && path.prerequisites.length > 0;
                const prerequisitesMet = !hasPrerequisites || path.prerequisites?.every(
                  (prereqId) => {
                    const prereqProgress = calculatePathProgress(prereqId, completedConcepts, stats.articlesReadSlugs);
                    return prereqProgress.percentage === 100;
                  }
                );

                return (
                  <Link
                    key={path.id}
                    href={`/parcours/${path.id}`}
                    className={`
                      group relative bg-bg-secondary border-3 p-6
                      transition-all duration-200
                      ${isCompleted
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20"
                        : "border-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal"
                      }
                      ${!prerequisitesMet ? "opacity-60" : ""}
                    `}
                  >
                    {/* Completed badge */}
                    {isCompleted && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500 text-white flex items-center justify-center text-lg">
                        ✓
                      </div>
                    )}

                    {/* Icon and title */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`
                        w-14 h-14 flex items-center justify-center text-3xl border-2
                        ${isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-400"
                          : "bg-accent/10 border-accent"
                        }
                      `}>
                        {path.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-text-primary group-hover:text-accent transition-colors">
                          {path.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-1.5 py-0.5 border ${levelColors[path.level]}`}>
                            {levelLabels[path.level]}
                          </span>
                          <span className="text-xs text-text-muted">
                            {path.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-muted mb-4 line-clamp-2">
                      {path.description}
                    </p>

                    {/* Progress */}
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs text-text-muted mb-1">
                        <span>{progress.completed} / {progress.total} étapes</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <div className="h-2 bg-border-light overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isCompleted ? "bg-emerald-500" : "bg-accent"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Prerequisites warning */}
                    {hasPrerequisites && !prerequisitesMet && (
                      <div className="mt-4 pt-3 border-t border-border-light">
                        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <span>⚠️</span>
                          Prérequis : terminer les parcours précédents
                        </p>
                      </div>
                    )}

                    {/* Steps preview */}
                    <div className="mt-4 pt-3 border-t border-border-light">
                      <div className="flex items-center gap-1">
                        {path.steps.slice(0, 5).map((step, index) => {
                          const isStepCompleted = isLoaded && (
                            (step.type === "concept" && completedConcepts.has(step.slug)) ||
                            (step.type === "article" && stats.articlesReadSlugs.includes(step.slug))
                          );
                          return (
                            <div
                              key={index}
                              className={`
                                w-6 h-6 flex items-center justify-center text-xs border
                                ${isStepCompleted
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "bg-bg-tertiary border-border-light text-text-muted"
                                }
                              `}
                              title={step.title}
                            >
                              {isStepCompleted ? "✓" : index + 1}
                            </div>
                          );
                        })}
                        {path.steps.length > 5 && (
                          <span className="text-xs text-text-muted ml-1">
                            +{path.steps.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div className="mt-12 bg-accent/10 border-3 border-accent p-8 text-center animate-fade-up">
        <h3 className="font-display text-2xl text-text-primary mb-2">
          Prêt à commencer ?
        </h3>
        <p className="text-text-muted mb-6 max-w-lg mx-auto">
          Choisissez un parcours débutant et progressez à votre rythme.
          Chaque parcours terminé vous rapporte 100 XP !
        </p>
        <Link
          href={`/parcours/${LEARNING_PATHS[0]?.id || ""}`}
          className="brutal-btn"
        >
          Commencer le premier parcours →
        </Link>
      </div>
    </div>
  );
}
