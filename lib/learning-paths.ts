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

// Parcours d'apprentissage
export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "maitriser-claude-code",
    title: "Maîtriser Claude Code",
    description:
      "De l'installation WSL au workflow Git complet : apprenez à utiliser Claude Code efficacement pour vos projets de développement.",
    icon: "robot",
    level: "debutant",
    estimatedTime: "2h30",
    steps: [
      {
        type: "concept",
        slug: "wsl",
        title: "Comprendre WSL",
        description:
          "Pourquoi Windows a besoin de WSL pour Claude Code et comment l'installer",
      },
      {
        type: "concept",
        slug: "terminal-wsl",
        title: "Naviguer dans le terminal WSL",
        description:
          "Basculer depuis PowerShell, trouver le vrai home, et naviguer efficacement",
      },
      {
        type: "concept",
        slug: "git",
        title: "Les bases de Git",
        description:
          "Comprendre les concepts fondamentaux de Git avant d'initialiser un projet",
      },
      {
        type: "article",
        slug: "guide-installation-claude-code-cli",
        title: "Installer Claude Code",
        description: "Guide pratique d'installation et configuration",
      },
      {
        type: "concept",
        slug: "claude-code",
        title: "Découvrir Claude Code",
        description: "Les fonctionnalités principales et cas d'usage",
      },
      {
        type: "concept",
        slug: "claude-code-modeles",
        title: "Choisir le bon modèle",
        description:
          "Haiku, Sonnet, Opus : comprendre les différences et quand les utiliser",
      },
      {
        type: "concept",
        slug: "claude-code-modes",
        title: "Modes Plan & Edit",
        description:
          "Utiliser Shift+Tab pour contrôler ce que Claude fait ou planifie",
      },
      {
        type: "concept",
        slug: "claude-code-pedagogie",
        title: "Apprendre en codant",
        description:
          "Activer les modes pédagogiques pour comprendre, pas juste copier",
      },
      {
        type: "concept",
        slug: "claude-code-plugins",
        title: "Plugins et extensions",
        description:
          "Étendre Claude Code avec frontend-design et autres plugins",
      },
      {
        type: "concept",
        slug: "git-workflow-claude",
        title: "Workflow Git efficace",
        description:
          "Commits fréquents, tâches petites, et bonnes pratiques avec Claude",
      },
    ],
  },
];

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
