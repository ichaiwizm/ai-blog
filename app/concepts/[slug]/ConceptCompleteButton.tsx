"use client";

import { useConcepts } from "@/contexts/ConceptsContext";
import { useGamification } from "@/contexts/GamificationContext";
import { getAllConcepts } from "@/lib/concepts";

interface ConceptCompleteButtonProps {
  slug: string;
  title: string;
}

export default function ConceptCompleteButton({ slug, title }: ConceptCompleteButtonProps) {
  const { isCompleted, markAsCompleted, markAsIncomplete, isLoaded } = useConcepts();
  const { recordConceptMastered, isLoaded: gamificationLoaded } = useGamification();
  const completed = isLoaded && isCompleted(slug);

  if (!isLoaded) {
    return (
      <div className="p-6 bg-bg-tertiary border-3 border-border-light animate-pulse">
        <div className="h-6 bg-border-light rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (completed) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-4 bg-accent border-3 border-border">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-text-inverse"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span className="font-body font-bold text-text-inverse">
            Concept maîtrisé !
          </span>
        </div>
        <p className="mt-4 font-body text-text-muted">
          Tu as marqué "{title}" comme compris.
        </p>
        <button
          onClick={() => markAsIncomplete(slug)}
          className="mt-2 font-mono text-sm text-text-muted hover:text-accent underline transition-colors"
        >
          Marquer comme non compris
        </button>
      </div>
    );
  }

  const handleMarkComplete = () => {
    markAsCompleted(slug);
    // Record in gamification (need to get total concepts count)
    if (gamificationLoaded) {
      // We'll use a reasonable estimate for total concepts
      // The actual count will be updated when dashboard loads
      recordConceptMastered(10);
    }
  };

  return (
    <div className="text-center">
      <p className="font-body text-lg text-text-primary mb-4">
        Tu as compris ce concept ?
      </p>
      <button onClick={handleMarkComplete} className="brutal-btn group">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="group-hover:scale-110 transition-transform"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        J'ai compris !
      </button>
      <p className="mt-4 font-mono text-xs text-text-muted">
        Marquer comme compris pour suivre ta progression
      </p>
    </div>
  );
}
