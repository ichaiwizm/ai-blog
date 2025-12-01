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
  estimatedTime: string; // e.g., "2h30"
  steps: LearningPathStep[];
  prerequisites?: string[]; // IDs of other paths
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "decouvrir-ia",
    title: "Découvrir l'IA",
    description: "Comprenez les fondamentaux de l'intelligence artificielle et des modèles de langage",
    icon: "🚀",
    level: "debutant",
    estimatedTime: "1h30",
    steps: [
      {
        type: "concept",
        slug: "modeles-ia",
        title: "Les modèles d'IA",
        description: "Comprendre ce qu'est un LLM et comment il fonctionne",
      },
      {
        type: "article",
        slug: "comprendre-prompts-llm",
        title: "Comprendre les prompts",
        description: "Apprendre à communiquer efficacement avec l'IA",
      },
      {
        type: "concept",
        slug: "ia-agentique",
        title: "L'IA agentique",
        description: "Découvrir les agents IA autonomes",
      },
    ],
  },
  {
    id: "maitriser-terminal",
    title: "Maîtriser le Terminal",
    description: "Devenez à l'aise avec la ligne de commande et les outils essentiels",
    icon: "💻",
    level: "debutant",
    estimatedTime: "2h",
    steps: [
      {
        type: "concept",
        slug: "terminal-basics",
        title: "Les bases du terminal",
        description: "Navigation et commandes essentielles",
      },
      {
        type: "concept",
        slug: "git-basics",
        title: "Git fondamentaux",
        description: "Versionner votre code comme un pro",
      },
      {
        type: "article",
        slug: "configurer-environnement-ia",
        title: "Configurer son environnement",
        description: "Préparer sa machine pour le développement IA",
      },
    ],
  },
  {
    id: "coder-avec-ia",
    title: "Coder avec l'IA",
    description: "Utilisez les assistants IA pour booster votre productivité de développeur",
    icon: "⚡",
    level: "intermediaire",
    estimatedTime: "3h",
    prerequisites: ["decouvrir-ia", "maitriser-terminal"],
    steps: [
      {
        type: "concept",
        slug: "terminal-basics",
        title: "Rappel : Le terminal",
        description: "Refresh sur les commandes essentielles",
      },
      {
        type: "concept",
        slug: "modeles-ia",
        title: "Rappel : Les modèles",
        description: "Refresh sur les LLM",
      },
      {
        type: "article",
        slug: "debuter-claude-code",
        title: "Débuter avec Claude Code",
        description: "Votre premier projet avec un assistant IA",
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
