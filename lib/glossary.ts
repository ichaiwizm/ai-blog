// Glossaire interactif - Définitions des termes techniques

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  shortDefinition: string; // Pour les tooltips
  category: "ia" | "dev" | "terminal" | "general";
  relatedConcepts?: string[]; // slugs des concepts liés
  relatedTerms?: string[]; // IDs d'autres termes du glossaire
  examples?: string[];
}

// Icons are string IDs that map to SVG components via ICON_MAP
export const GLOSSARY_CATEGORIES = {
  ia: { name: "Intelligence Artificielle", icon: "robot", color: "accent" },
  dev: { name: "Développement", icon: "code", color: "emerald" },
  terminal: { name: "Terminal & CLI", icon: "terminal", color: "amber" },
  general: { name: "Général", icon: "books", color: "slate" },
} as const;

// Glossaire vide - à remplir avec le contenu
export const GLOSSARY: GlossaryTerm[] = [];

// Helper functions
export function getTermById(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((term) => term.id === id);
}

export function getTermByName(name: string): GlossaryTerm | undefined {
  const normalizedName = name.toLowerCase();
  return GLOSSARY.find(
    (term) =>
      term.term.toLowerCase() === normalizedName ||
      term.id.toLowerCase() === normalizedName
  );
}

export function getTermsByCategory(category: GlossaryTerm["category"]): GlossaryTerm[] {
  return GLOSSARY.filter((term) => term.category === category);
}

export function searchGlossary(query: string): GlossaryTerm[] {
  const normalizedQuery = query.toLowerCase();
  return GLOSSARY.filter(
    (term) =>
      term.term.toLowerCase().includes(normalizedQuery) ||
      term.definition.toLowerCase().includes(normalizedQuery) ||
      term.shortDefinition.toLowerCase().includes(normalizedQuery)
  );
}

export function getRelatedTerms(termId: string): GlossaryTerm[] {
  const term = getTermById(termId);
  if (!term || !term.relatedTerms) return [];
  return term.relatedTerms
    .map((id) => getTermById(id))
    .filter((t): t is GlossaryTerm => t !== undefined);
}
