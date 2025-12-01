import Link from "next/link";
import { getAllConcepts, CONCEPT_LEVELS, ConceptLevel } from "@/lib/concepts";
import Breadcrumbs from "@/components/Breadcrumbs";
import ConceptCardClient from "./ConceptCardClient";

export const metadata = {
  title: "Concepts - AI Blog",
  description: "Les concepts fondamentaux pour maîtriser le développement avec l'IA",
};

export default function ConceptsPage() {
  const concepts = getAllConcepts();

  // Group by level
  const conceptsByLevel = {
    debutant: concepts.filter((c) => c.level === "debutant"),
    intermediaire: concepts.filter((c) => c.level === "intermediaire"),
    avance: concepts.filter((c) => c.level === "avance"),
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-8 sm:py-12 md:py-16">
          <div className="mb-4 sm:mb-6 animate-fade-up">
            <Breadcrumbs
              items={[
                { label: "Accueil", href: "/" },
                { label: "Concepts" },
              ]}
            />
          </div>

          <div className="max-w-3xl">
            <div className="inline-block px-2 sm:px-3 py-1 bg-accent text-text-inverse font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6 animate-fade-up stagger-1">
              Base de connaissances
            </div>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-text-primary leading-[1.1] mb-4 sm:mb-6 animate-fade-up stagger-2">
              Concepts Fondamentaux
            </h1>
            <p className="font-body text-base sm:text-lg md:text-xl text-text-muted leading-relaxed animate-fade-up stagger-3">
              Maîtrise les concepts clés avant de te lancer. Chaque concept débloqué te
              rapproche de la maîtrise du développement avec l'IA.
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container-default py-8 sm:py-12 md:py-16">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 md:mb-16">
          {(Object.entries(CONCEPT_LEVELS) as [ConceptLevel, typeof CONCEPT_LEVELS[ConceptLevel]][]).map(
            ([level, info]) => (
              <div
                key={level}
                className="border-3 border-border bg-bg-secondary p-3 sm:p-4 md:p-6 text-center"
              >
                <p className="font-display text-xl sm:text-2xl md:text-3xl text-text-primary mb-0.5 sm:mb-1">
                  {conceptsByLevel[level].length}
                </p>
                <p
                  className={`font-mono text-[10px] sm:text-xs uppercase tracking-wider ${
                    level === "debutant"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : level === "intermediaire"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {info.label}
                </p>
              </div>
            )
          )}
        </div>

        {/* Concepts by level */}
        {(["debutant", "intermediaire", "avance"] as ConceptLevel[]).map((level) => {
          const levelConcepts = conceptsByLevel[level];
          if (levelConcepts.length === 0) return null;

          const levelInfo = CONCEPT_LEVELS[level];

          return (
            <section key={level} className="mb-8 sm:mb-12 md:mb-16 last:mb-0">
              <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
                <h2 className="font-display text-xl sm:text-2xl md:text-3xl text-text-primary">
                  {levelInfo.label}
                </h2>
                <div className="flex-1 h-0.5 bg-border-light" />
                <span
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 font-mono text-[10px] sm:text-xs font-semibold uppercase ${
                    level === "debutant"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : level === "intermediaire"
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                  }`}
                >
                  {levelConcepts.length} concept{levelConcepts.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {levelConcepts.map((concept) => (
                  <ConceptCardClient key={concept.slug} concept={concept} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Empty state */}
        {concepts.length === 0 && (
          <div className="text-center py-20 border-3 border-dashed border-border-light">
            <p className="font-display text-2xl text-text-muted mb-4">
              Aucun concept pour le moment
            </p>
            <p className="font-body text-text-muted">
              Les concepts seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
