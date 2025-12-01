"use client";

import Link from "next/link";
import { useConcepts } from "@/contexts/ConceptsContext";
import { ConceptMeta, CONCEPT_LEVELS } from "@/lib/concepts-types";

interface ConceptCardClientProps {
  concept: ConceptMeta;
}

export default function ConceptCardClient({ concept }: ConceptCardClientProps) {
  const { isCompleted, isLoaded } = useConcepts();
  const completed = isLoaded && isCompleted(concept.slug);
  const levelInfo = CONCEPT_LEVELS[concept.level];

  return (
    <Link
      href={`/concepts/${concept.slug}`}
      className={`group block border-3 border-border bg-bg-secondary p-6 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-hover ${
        completed ? "bg-accent-light" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <span className="text-4xl">{concept.icon}</span>
        {completed && (
          <div className="w-8 h-8 bg-accent border-2 border-border flex items-center justify-center flex-shrink-0">
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
          </div>
        )}
      </div>

      {/* Level badge */}
      <span
        className={`inline-block px-2 py-0.5 font-mono text-xs font-medium uppercase mb-3 ${
          concept.level === "debutant"
            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            : concept.level === "intermediaire"
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
            : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
        }`}
      >
        {levelInfo.label}
      </span>

      {/* Title */}
      <h3
        className={`font-body text-lg font-bold mb-2 transition-colors ${
          completed
            ? "text-text-muted"
            : "text-text-primary group-hover:text-accent"
        }`}
      >
        {concept.title}
      </h3>

      {/* Description */}
      <p className="font-body text-sm text-text-muted line-clamp-2 mb-4">
        {concept.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <span className="font-mono text-xs text-text-muted">
          {concept.readingTime}
        </span>
        <span className="font-mono text-xs text-accent group-hover:underline">
          {completed ? "Revoir" : "Apprendre"} →
        </span>
      </div>
    </Link>
  );
}
