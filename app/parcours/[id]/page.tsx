"use client";

import { LEARNING_PATHS, getLearningPathById, calculatePathProgress, getNextStepInPath } from "@/lib/learning-paths";
import { useConcepts } from "@/contexts/ConceptsContext";
import { useGamification } from "@/contexts/GamificationContext";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconByName, TrophyIcon, CelebrationIcon, SparklesIcon, WarningIcon, CheckIcon } from "@/components/icons";

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

export default function ParcoursDetailPage() {
  const params = useParams();
  const pathId = params.id as string;
  const path = getLearningPathById(pathId);

  const { completedConcepts, isLoaded: conceptsLoaded } = useConcepts();
  const { stats, recordPathCompleted, isLoaded: gamificationLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoaded = mounted && conceptsLoaded && gamificationLoaded;

  if (!path) {
    notFound();
  }

  const progress = isLoaded
    ? calculatePathProgress(path.id, completedConcepts, stats.articlesReadSlugs)
    : { completed: 0, total: path.steps.length, percentage: 0 };

  const isCompleted = progress.percentage === 100;
  const nextStep = isLoaded ? getNextStepInPath(path.id, completedConcepts, stats.articlesReadSlugs) : null;

  // Check if path was just completed
  useEffect(() => {
    if (isLoaded && isCompleted && !stats.pathsCompletedIds.includes(path.id)) {
      recordPathCompleted(path.id);
      setShowCompletedModal(true);
    }
  }, [isLoaded, isCompleted, path.id, stats.pathsCompletedIds, recordPathCompleted]);

  // Get prerequisite paths
  const prerequisitePaths = path.prerequisites
    ?.map((id) => getLearningPathById(id))
    .filter(Boolean) || [];

  return (
    <div className="container-default py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 animate-fade-up">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link href="/parcours" className="text-text-muted hover:text-accent">
              Parcours
            </Link>
          </li>
          <li className="text-text-muted">/</li>
          <li className="text-text-primary font-medium">{path.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12 animate-fade-up">
        <div className="flex items-start gap-6">
          <div className={`
            w-20 h-20 flex items-center justify-center border-3 shrink-0
            ${isCompleted
              ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-600"
              : "bg-accent/10 border-accent text-accent"
            }
          `}>
            <IconByName name={path.icon} size={40} />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-xs px-2 py-0.5 border-2 ${levelColors[path.level]}`}>
                {levelLabels[path.level]}
              </span>
              <span className="text-sm text-text-muted">{path.estimatedTime}</span>
              {isCompleted && (
                <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckIcon size={14} /> Complété
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl md:text-4xl text-text-primary mb-3">
              {path.title}
            </h1>
            <p className="text-lg text-text-muted max-w-2xl">
              {path.description}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 max-w-2xl">
          <div className="flex justify-between text-sm text-text-muted mb-2">
            <span>{progress.completed} / {progress.total} étapes complétées</span>
            <span className="font-mono">{progress.percentage}%</span>
          </div>
          <div className="h-3 bg-border-light overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                isCompleted ? "bg-emerald-500" : "bg-accent"
              }`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Next step CTA */}
        {nextStep && !isCompleted && (
          <div className="mt-6">
            <Link
              href={nextStep.type === "concept" ? `/concepts/${nextStep.slug}` : `/blog/${nextStep.slug}`}
              className="brutal-btn"
            >
              Continuer : {nextStep.title} →
            </Link>
          </div>
        )}
      </div>

      {/* Prerequisites */}
      {prerequisitePaths.length > 0 && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border-3 border-amber-400 animate-fade-up">
          <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
            <WarningIcon size={18} /> Prérequis recommandés
          </h3>
          <p className="text-sm text-text-muted mb-3">
            Pour tirer le meilleur parti de ce parcours, complétez d'abord :
          </p>
          <div className="flex flex-wrap gap-2">
            {prerequisitePaths.map((prereq) => {
              if (!prereq) return null;
              const prereqProgress = calculatePathProgress(prereq.id, completedConcepts, stats.articlesReadSlugs);
              const prereqCompleted = prereqProgress.percentage === 100;
              return (
                <Link
                  key={prereq.id}
                  href={`/parcours/${prereq.id}`}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 border-2 text-sm
                    ${prereqCompleted
                      ? "bg-emerald-100 dark:bg-emerald-900/50 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                      : "bg-bg-secondary border-border hover:border-accent"
                    }
                  `}
                >
                  <IconByName name={prereq.icon} size={16} />
                  <span>{prereq.title}</span>
                  {prereqCompleted && <CheckIcon size={14} />}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="animate-fade-up stagger-2">
        <h2 className="font-display text-2xl text-text-primary mb-6">
          Étapes du parcours
        </h2>

        <div className="space-y-4">
          {path.steps.map((step, index) => {
            const isStepCompleted = isLoaded && (
              (step.type === "concept" && completedConcepts.has(step.slug)) ||
              (step.type === "article" && stats.articlesReadSlugs.includes(step.slug))
            );
            const isCurrentStep = nextStep?.slug === step.slug;
            const href = step.type === "concept" ? `/concepts/${step.slug}` : `/blog/${step.slug}`;

            return (
              <Link
                key={`${step.type}-${step.slug}`}
                href={href}
                className={`
                  group flex items-start gap-4 p-4 border-3 transition-all
                  ${isStepCompleted
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-400"
                    : isCurrentStep
                    ? "bg-accent/10 border-accent"
                    : "bg-bg-secondary border-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal"
                  }
                `}
              >
                {/* Step number / checkmark */}
                <div
                  className={`
                    w-10 h-10 flex items-center justify-center shrink-0 border-2 font-mono font-bold
                    ${isStepCompleted
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isCurrentStep
                      ? "bg-accent border-accent text-white"
                      : "bg-bg-tertiary border-border text-text-muted"
                    }
                  `}
                >
                  {isStepCompleted ? <CheckIcon size={18} /> : index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      text-xs px-1.5 py-0.5 border font-mono uppercase
                      ${step.type === "concept"
                        ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-700 dark:text-emerald-400"
                        : "bg-accent/10 border-accent text-accent"
                      }
                    `}>
                      {step.type === "concept" ? "Concept" : "Article"}
                    </span>
                    {isCurrentStep && (
                      <span className="text-xs px-1.5 py-0.5 bg-accent text-white">
                        En cours
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-text-muted mt-1">
                      {step.description}
                    </p>
                  )}
                </div>

                {/* Arrow */}
                <div className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all">
                  →
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Completion reward info */}
      <div className="mt-12 bg-bg-tertiary border-3 border-border p-6 animate-fade-up">
        <div className="flex items-center gap-4">
          <div className="text-amber-500"><TrophyIcon size={40} /></div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Récompense à la complétion
            </h3>
            <p className="text-sm text-text-muted">
              Terminez ce parcours pour gagner <span className="font-mono text-accent font-bold">+100 XP</span> et
              débloquer le badge <span className="font-semibold">Explorateur</span> !
            </p>
          </div>
        </div>
      </div>

      {/* Completed Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-secondary border-3 border-border shadow-brutal-lg max-w-md w-full p-8 text-center animate-scale-up">
            <div className="flex justify-center text-amber-500 mb-4"><CelebrationIcon size={64} /></div>
            <h2 className="font-display text-3xl text-text-primary mb-2">
              Parcours Complété !
            </h2>
            <p className="text-text-muted mb-6">
              Félicitations ! Vous avez terminé le parcours "{path.title}".
            </p>
            <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-accent/10 border-2 border-accent">
              <span className="text-accent"><SparklesIcon size={24} /></span>
              <span className="font-mono text-xl font-bold text-accent">+100 XP</span>
            </div>
            <button
              onClick={() => setShowCompletedModal(false)}
              className="brutal-btn w-full"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
