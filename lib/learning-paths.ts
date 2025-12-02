// Learning Paths - Parcours guidés d'apprentissage

export interface LearningPathStep {
  type: "concept" | "article";
  slug: string;
  title: string;
  description?: string;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  level: "debutant" | "intermediaire" | "avance";
  estimatedTime: string;
  steps: LearningPathStep[];
  prerequisites?: string[]; // IDs of other paths
}

// Parcours vides - à remplir avec le contenu
export const LEARNING_PATHS: LearningPath[] = [];

// Helper functions
export function getLearningPathById(id: string): LearningPath | undefined {
  return LEARNING_PATHS.find((path) => path.id === id);
}

export function getLearningPathsByLevel(level: LearningPath["level"]): LearningPath[] {
  return LEARNING_PATHS.filter((path) => path.level === level);
}

export function calculatePathProgress(
  pathId: string,
  completedConcepts: Set<string>,
  readArticles: string[]
): { completed: number; total: number; percentage: number } {
  const path = getLearningPathById(pathId);
  if (!path) return { completed: 0, total: 0, percentage: 0 };

  let completed = 0;
  const total = path.steps.length;

  path.steps.forEach((step) => {
    if (step.type === "concept" && completedConcepts.has(step.slug)) {
      completed++;
    } else if (step.type === "article" && readArticles.includes(step.slug)) {
      completed++;
    }
  });

  return {
    completed,
    total,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

export function isPathCompleted(
  pathId: string,
  completedConcepts: Set<string>,
  readArticles: string[]
): boolean {
  const progress = calculatePathProgress(pathId, completedConcepts, readArticles);
  return progress.percentage === 100;
}

export function getNextStepInPath(
  pathId: string,
  completedConcepts: Set<string>,
  readArticles: string[]
): LearningPathStep | null {
  const path = getLearningPathById(pathId);
  if (!path) return null;

  for (const step of path.steps) {
    if (step.type === "concept" && !completedConcepts.has(step.slug)) {
      return step;
    }
    if (step.type === "article" && !readArticles.includes(step.slug)) {
      return step;
    }
  }

  return null;
}
