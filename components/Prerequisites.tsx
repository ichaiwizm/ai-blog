"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConcepts } from "@/contexts/ConceptsContext";
import { ConceptMeta, CONCEPT_LEVELS } from "@/lib/concepts-types";

interface PrerequisitesProps {
  concepts: ConceptMeta[];
}

export default function Prerequisites({ concepts }: PrerequisitesProps) {
  const { isCompleted, isLoaded } = useConcepts();
  const [isExpanded, setIsExpanded] = useState(true);

  const completedCount = concepts.filter((c) => isCompleted(c.slug)).length;
  const allCompleted = isLoaded && completedCount === concepts.length;
  const progress = (completedCount / concepts.length) * 100;

  // Auto-collapse when all completed
  useEffect(() => {
    if (isLoaded && allCompleted) {
      setIsExpanded(false);
    }
  }, [isLoaded, allCompleted]);

  if (concepts.length === 0) return null;

  return (
    <div className={`my-8 border-3 bg-bg-secondary not-prose transition-all ${
      allCompleted ? "border-accent" : "border-border"
    }`}>
      {/* Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full px-5 py-4 bg-bg-tertiary text-left transition-all hover:bg-bg-secondary ${
          isExpanded ? "border-b-2 border-border" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            {/* Icon changes based on completion */}
            <div className={`w-10 h-10 border-2 border-border flex items-center justify-center transition-colors ${
              allCompleted ? "bg-accent" : "bg-accent"
            }`}>
              {allCompleted ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-text-inverse"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="text-text-inverse"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  <path d="M8 7h6" />
                  <path d="M8 11h8" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="font-body font-bold text-text-primary text-lg">
                Prérequis
              </h3>
              <p className="font-mono text-xs text-text-muted">
                {allCompleted
                  ? "Tu es prêt ! Tous les concepts sont maîtrisés"
                  : `${completedCount}/${concepts.length} concepts maîtrisés`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress bar */}
            {isLoaded && (
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-bg-primary border border-border">
                  <div
                    className="h-full bg-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Expand/Collapse icon */}
            <div className={`w-8 h-8 flex items-center justify-center border-2 border-border bg-bg-secondary transition-transform ${
              isExpanded ? "" : "rotate-180"
            }`}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-text-muted"
              >
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {/* Concepts list - Collapsible */}
      <div className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="divide-y divide-border-light">
          {concepts.map((concept) => (
            <PrerequisiteItem
              key={concept.slug}
              concept={concept}
              isCompleted={isLoaded && isCompleted(concept.slug)}
            />
          ))}
        </div>

        {/* Footer tip */}
        {!allCompleted && (
          <div className="px-5 py-3 border-t-2 border-border-light bg-accent-light">
            <p className="font-mono text-xs text-text-muted">
              <span className="font-semibold">Conseil :</span> Consulte les concepts que tu ne maîtrises pas encore avant de continuer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface PrerequisiteItemProps {
  concept: ConceptMeta;
  isCompleted: boolean;
}

function PrerequisiteItem({ concept, isCompleted }: PrerequisiteItemProps) {
  const levelInfo = CONCEPT_LEVELS[concept.level];

  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className={`flex items-center gap-4 px-5 py-4 transition-all group ${
        isCompleted
          ? "bg-bg-secondary hover:bg-bg-tertiary"
          : "bg-bg-secondary hover:bg-accent-light"
      }`}
    >
      {/* Status icon */}
      <div
        className={`w-8 h-8 flex items-center justify-center border-2 transition-all ${
          isCompleted
            ? "bg-accent border-accent"
            : "bg-bg-tertiary border-border group-hover:border-accent"
        }`}
      >
        {isCompleted ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-text-inverse"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <span className="text-lg">{concept.icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4
            className={`font-body font-semibold transition-colors ${
              isCompleted ? "text-text-muted line-through" : "text-text-primary group-hover:text-accent"
            }`}
          >
            {concept.title}
          </h4>
          <span
            className={`px-2 py-0.5 font-mono text-xs font-medium uppercase ${
              concept.level === "debutant"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : concept.level === "intermediaire"
                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            }`}
          >
            {levelInfo.label}
          </span>
        </div>
        <p className="font-body text-sm text-text-muted line-clamp-1 mt-0.5">
          {concept.description}
        </p>
      </div>

      {/* Arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// Compact version for sidebar or footer
interface PrerequisitesCompactProps {
  concepts: ConceptMeta[];
}

export function PrerequisitesCompact({ concepts }: PrerequisitesCompactProps) {
  const { isCompleted, isLoaded } = useConcepts();

  if (concepts.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {concepts.map((concept) => {
        const completed = isLoaded && isCompleted(concept.slug);
        return (
          <Link
            key={concept.slug}
            href={`/concepts/${concept.slug}`}
            className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 transition-all font-mono text-sm ${
              completed
                ? "border-accent bg-accent text-text-inverse"
                : "border-border bg-bg-tertiary text-text-muted hover:border-accent hover:text-accent"
            }`}
            title={concept.description}
          >
            <span>{concept.icon}</span>
            <span>{concept.title}</span>
            {completed && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </Link>
        );
      })}
    </div>
  );
}
