// Types and constants for concepts - safe to import in client components

export type ConceptLevel = "debutant" | "intermediaire" | "avance";

export const CONCEPT_LEVELS: Record<ConceptLevel, { label: string; color: string }> = {
  debutant: { label: "Débutant", color: "emerald" },
  intermediaire: { label: "Intermédiaire", color: "amber" },
  avance: { label: "Avancé", color: "rose" },
};

export interface ConceptMeta {
  slug: string;
  title: string;
  description: string;
  icon: string;
  level: ConceptLevel;
  readingTime: string;
  order: number;
}

export interface Concept extends ConceptMeta {
  content: string;
}
