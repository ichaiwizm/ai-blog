"use client";

import { GLOSSARY, GLOSSARY_CATEGORIES, GlossaryTerm, getRelatedTerms } from "@/lib/glossary";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { IconByName, BooksIcon } from "@/components/icons";

type CategoryFilter = GlossaryTerm["category"] | "all";

export default function GlossairePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  // Handle hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setExpandedTerm(hash);
      // Scroll to element
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY.filter((term) => {
      // Category filter
      if (category !== "all" && term.category !== category) return false;

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        return (
          term.term.toLowerCase().includes(query) ||
          term.definition.toLowerCase().includes(query) ||
          term.shortDefinition.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [search, category]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const sortedLetters = Object.keys(groupedTerms).sort();

  return (
    <div className="container-default py-8 sm:py-10 md:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-up">
        <span className="inline-block px-2 sm:px-3 py-1 bg-accent text-white text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          Référence
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary mb-3 sm:mb-4">
          Glossaire
        </h1>
        <p className="text-base sm:text-lg text-text-muted max-w-2xl">
          Toutes les définitions des termes techniques liés à l'IA, au développement et au terminal.
          Cliquez sur un terme pour voir sa définition complète.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-up stagger-1">
        {/* Search */}
        <div className="w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un terme..."
            className="w-full brutal-input text-sm sm:text-base"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 sm:gap-2 flex-wrap">
          <button
            onClick={() => setCategory("all")}
            className={`
              px-3 sm:px-4 py-2 border-2 text-xs sm:text-sm font-medium transition-all touch-target
              ${category === "all"
                ? "bg-accent border-accent text-white"
                : "bg-bg-secondary border-border hover:border-accent"
              }
            `}
          >
            Tous
          </button>
          {(Object.keys(GLOSSARY_CATEGORIES) as GlossaryTerm["category"][]).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`
                px-3 sm:px-4 py-2 border-2 text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-2 touch-target
                ${category === cat
                  ? "bg-accent border-accent text-white"
                  : "bg-bg-secondary border-border hover:border-accent"
                }
              `}
            >
              <IconByName name={GLOSSARY_CATEGORIES[cat].icon} size={14} />
              <span className="hidden xs:inline">{GLOSSARY_CATEGORIES[cat].name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alphabet navigation */}
      <div className="flex flex-wrap gap-0.5 sm:gap-1 mb-6 sm:mb-8 p-2 sm:p-3 bg-bg-secondary border-3 border-border animate-fade-up stagger-2">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => {
          const hasTerms = groupedTerms[letter]?.length > 0;
          return (
            <button
              key={letter}
              onClick={() => {
                if (hasTerms) {
                  const element = document.getElementById(`letter-${letter}`);
                  element?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
              disabled={!hasTerms}
              className={`
                w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono font-bold text-xs sm:text-sm
                ${hasTerms
                  ? "hover:bg-accent hover:text-white cursor-pointer"
                  : "opacity-30 cursor-not-allowed"
                }
              `}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="mb-6 sm:mb-8 text-xs sm:text-sm text-text-muted animate-fade-up stagger-3">
        {filteredTerms.length} terme{filteredTerms.length !== 1 ? "s" : ""} trouvé{filteredTerms.length !== 1 ? "s" : ""}
      </div>

      {/* Terms list */}
      {sortedLetters.length === 0 ? (
        <div className="text-center py-12 animate-fade-up">
          <p className="text-text-muted text-lg">
            Aucun terme trouvé pour "{search}"
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8 animate-fade-up stagger-4">
          {sortedLetters.map((letter) => (
            <div key={letter} id={`letter-${letter}`}>
              {/* Letter header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent text-white flex items-center justify-center font-display text-xl sm:text-2xl">
                  {letter}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Terms */}
              <div className="space-y-3">
                {groupedTerms[letter].map((term) => {
                  const isExpanded = expandedTerm === term.id;
                  const relatedTerms = getRelatedTerms(term.id);
                  const categoryInfo = GLOSSARY_CATEGORIES[term.category];

                  return (
                    <div
                      key={term.id}
                      id={term.id}
                      className={`
                        bg-bg-secondary border-3 transition-all
                        ${isExpanded
                          ? "border-accent shadow-brutal-accent"
                          : "border-border hover:border-accent"
                        }
                      `}
                    >
                      {/* Header (clickable) */}
                      <button
                        onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                        className="w-full p-4 text-left flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-display text-xl text-text-primary">
                              {term.term}
                            </h3>
                            <span className={`
                              text-xs px-2 py-0.5 border flex items-center gap-1
                              ${term.category === "ia" ? "bg-rose-50 dark:bg-rose-900/30 border-rose-400 text-rose-600 dark:text-rose-400" : ""}
                              ${term.category === "dev" ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400" : ""}
                              ${term.category === "terminal" ? "bg-amber-50 dark:bg-amber-900/30 border-amber-400 text-amber-600 dark:text-amber-400" : ""}
                              ${term.category === "general" ? "bg-slate-50 dark:bg-slate-900/30 border-slate-400 text-slate-600 dark:text-slate-400" : ""}
                            `}>
                              <IconByName name={categoryInfo.icon} size={12} /> {categoryInfo.name}
                            </span>
                          </div>
                          <p className="text-text-muted mt-1">
                            {term.shortDefinition}
                          </p>
                        </div>
                        <span
                          className={`
                            text-xl text-text-muted transition-transform
                            ${isExpanded ? "rotate-180" : ""}
                          `}
                        >
                          ↓
                        </span>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-border-light">
                          <div className="pt-4">
                            {/* Full definition */}
                            <p className="text-text-body leading-relaxed mb-4">
                              {term.definition}
                            </p>

                            {/* Examples */}
                            {term.examples && term.examples.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                                  Exemples
                                </h4>
                                <div className="space-y-2">
                                  {term.examples.map((example, index) => (
                                    <code
                                      key={index}
                                      className="block px-3 py-2 bg-bg-tertiary border border-border-light font-mono text-sm text-text-body"
                                    >
                                      {example}
                                    </code>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Related concepts */}
                            {term.relatedConcepts && term.relatedConcepts.length > 0 && (
                              <div className="mb-4">
                                <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                                  Concepts associés
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {term.relatedConcepts.map((conceptSlug) => (
                                    <Link
                                      key={conceptSlug}
                                      href={`/concepts/${conceptSlug}`}
                                      className="px-3 py-1.5 bg-accent/10 border-2 border-accent text-accent text-sm hover:bg-accent hover:text-white transition-colors flex items-center gap-1"
                                    >
                                      <BooksIcon size={14} /> {conceptSlug}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Related terms */}
                            {relatedTerms.length > 0 && (
                              <div>
                                <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2">
                                  Termes associés
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {relatedTerms.map((relatedTerm) => (
                                    <button
                                      key={relatedTerm.id}
                                      onClick={() => {
                                        setExpandedTerm(relatedTerm.id);
                                        document.getElementById(relatedTerm.id)?.scrollIntoView({
                                          behavior: "smooth",
                                          block: "center",
                                        });
                                      }}
                                      className="px-3 py-1.5 bg-bg-tertiary border border-border-light text-sm hover:border-accent transition-colors"
                                    >
                                      {relatedTerm.term}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
