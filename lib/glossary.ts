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

export const GLOSSARY: GlossaryTerm[] = [
  // ===== INTELLIGENCE ARTIFICIELLE =====
  {
    id: "ia",
    term: "IA (Intelligence Artificielle)",
    definition: "Domaine de l'informatique visant à créer des systèmes capables d'exécuter des tâches nécessitant habituellement l'intelligence humaine. Cela inclut l'apprentissage, le raisonnement, la perception et la compréhension du langage naturel.",
    shortDefinition: "Systèmes informatiques simulant l'intelligence humaine",
    category: "ia",
    relatedConcepts: ["prompt", "claude-code"],
    relatedTerms: ["llm", "chatgpt", "claude"],
  },
  {
    id: "llm",
    term: "LLM (Large Language Model)",
    definition: "Modèle d'apprentissage automatique entraîné sur de vastes corpus textuels. Les LLM sont capables de comprendre et générer du texte en langage naturel. GPT-4, Claude et Llama sont des exemples de LLM.",
    shortDefinition: "Modèle d'IA entraîné sur de grands volumes de texte",
    category: "ia",
    relatedTerms: ["ia", "chatgpt", "claude"],
  },
  {
    id: "chatgpt",
    term: "ChatGPT",
    definition: "Assistant conversationnel développé par OpenAI, basé sur les modèles GPT. Lancé en novembre 2022, il a popularisé l'utilisation des LLM auprès du grand public.",
    shortDefinition: "Assistant IA conversationnel d'OpenAI",
    category: "ia",
    relatedTerms: ["ia", "llm", "claude"],
  },
  {
    id: "claude",
    term: "Claude",
    definition: "Assistant IA développé par Anthropic. Conçu avec une attention particulière à la sécurité et à l'alignement. Disponible en plusieurs versions : Haiku, Sonnet et Opus.",
    shortDefinition: "Assistant IA développé par Anthropic",
    category: "ia",
    relatedConcepts: ["claude-code", "prompt"],
    relatedTerms: ["ia", "llm", "chatgpt"],
  },
  {
    id: "token",
    term: "Token",
    definition: "Unité de base utilisée par les LLM pour traiter le texte. Un token peut représenter un mot, une partie de mot ou un caractère de ponctuation. La facturation des API d'IA est généralement basée sur le nombre de tokens traités.",
    shortDefinition: "Unité de texte traitée par un modèle de langage",
    category: "ia",
    relatedTerms: ["llm"],
  },
  {
    id: "ai-slop",
    term: "AI Slop",
    definition: "Terme argotique désignant du contenu généré par IA de qualité médiocre, reconnaissable par son style générique, ses formulations répétitives et son manque de personnalité.",
    shortDefinition: "Contenu IA de mauvaise qualité",
    category: "ia",
  },

  // ===== DÉVELOPPEMENT =====
  {
    id: "stack",
    term: "Stack (technique)",
    definition: "Ensemble des technologies utilisées pour développer une application. Une stack comprend généralement un framework frontend, un langage backend, une base de données et des outils de déploiement.",
    shortDefinition: "Ensemble des technologies d'un projet",
    category: "dev",
    relatedConcepts: ["nextjs", "typescript"],
  },
  {
    id: "framework",
    term: "Framework",
    definition: "Structure logicielle fournissant une base et des conventions pour le développement d'applications. Un framework impose une architecture et fournit des fonctionnalités prêtes à l'emploi.",
    shortDefinition: "Structure de base pour développer des applications",
    category: "dev",
    relatedConcepts: ["nextjs"],
    relatedTerms: ["stack"],
  },
  {
    id: "tailwind",
    term: "Tailwind CSS",
    definition: "Framework CSS utilitaire permettant de styliser des interfaces directement dans le HTML via des classes prédéfinies. Approche alternative aux feuilles de style traditionnelles.",
    shortDefinition: "Framework CSS basé sur des classes utilitaires",
    category: "dev",
    relatedTerms: ["framework", "stack"],
  },
  {
    id: "mdx",
    term: "MDX",
    definition: "Format de fichier combinant Markdown et JSX. Permet d'intégrer des composants React interactifs dans des documents textuels. Utilisé pour créer du contenu enrichi dans les applications React.",
    shortDefinition: "Markdown avec composants React intégrés",
    category: "dev",
    relatedConcepts: ["nextjs"],
  },
  {
    id: "react",
    term: "React",
    definition: "Bibliothèque JavaScript développée par Meta pour créer des interfaces utilisateur. Basée sur le concept de composants réutilisables et un DOM virtuel pour optimiser les performances.",
    shortDefinition: "Bibliothèque JavaScript pour interfaces utilisateur",
    category: "dev",
    relatedConcepts: ["nextjs"],
    relatedTerms: ["framework", "jsx"],
  },
  {
    id: "jsx",
    term: "JSX",
    definition: "Extension syntaxique de JavaScript permettant d'écrire du HTML dans du code JavaScript. Utilisée principalement avec React pour décrire l'interface utilisateur.",
    shortDefinition: "Syntaxe HTML dans JavaScript",
    category: "dev",
    relatedTerms: ["react", "mdx"],
  },
  {
    id: "npm",
    term: "npm",
    definition: "Node Package Manager. Gestionnaire de paquets pour JavaScript permettant d'installer, partager et gérer les dépendances d'un projet Node.js.",
    shortDefinition: "Gestionnaire de paquets JavaScript",
    category: "dev",
    relatedTerms: ["dependances"],
  },
  {
    id: "dependances",
    term: "Dépendances",
    definition: "Bibliothèques externes dont un projet a besoin pour fonctionner. Elles sont déclarées dans un fichier de configuration et installées via un gestionnaire de paquets.",
    shortDefinition: "Bibliothèques externes requises par un projet",
    category: "dev",
    relatedTerms: ["npm"],
  },
  {
    id: "bundler",
    term: "Bundler",
    definition: "Outil transformant le code source et ses dépendances en fichiers optimisés pour la production. Webpack et Vite sont des bundlers populaires.",
    shortDefinition: "Outil d'assemblage et d'optimisation du code",
    category: "dev",
    relatedTerms: ["webpack", "vite"],
  },
  {
    id: "webpack",
    term: "Webpack",
    definition: "Bundler JavaScript historique permettant de transformer et assembler les assets d'une application web. Hautement configurable mais complexe à paramétrer.",
    shortDefinition: "Bundler JavaScript configurable",
    category: "dev",
    relatedTerms: ["bundler", "vite"],
  },
  {
    id: "vite",
    term: "Vite",
    definition: "Bundler JavaScript moderne offrant un démarrage instantané en développement grâce aux ES modules natifs. Alternative plus rapide et simple à Webpack.",
    shortDefinition: "Bundler JavaScript rapide et moderne",
    category: "dev",
    relatedTerms: ["bundler", "webpack"],
  },
  {
    id: "debug",
    term: "Debug / Débogage",
    definition: "Processus d'identification et de correction des erreurs dans un programme. Le terme vient de l'anglais 'bug' (insecte), en référence à un incident historique impliquant un vrai insecte dans un ordinateur.",
    shortDefinition: "Recherche et correction des erreurs",
    category: "dev",
  },
  {
    id: "pwa",
    term: "PWA (Progressive Web App)",
    definition: "Application web offrant une expérience similaire à une application native. Une PWA peut être installée sur l'écran d'accueil, fonctionner hors ligne et envoyer des notifications.",
    shortDefinition: "Application web installable sur mobile",
    category: "dev",
  },
  {
    id: "gamification",
    term: "Gamification",
    definition: "Application de mécaniques de jeu (points, badges, niveaux, classements) dans des contextes non ludiques pour augmenter l'engagement des utilisateurs.",
    shortDefinition: "Mécaniques de jeu appliquées hors jeu",
    category: "dev",
    relatedTerms: ["xp"],
  },
  {
    id: "xp",
    term: "XP (Experience Points)",
    definition: "Points d'expérience attribués pour récompenser des actions dans un système gamifié. L'accumulation de XP permet généralement de progresser en niveau.",
    shortDefinition: "Points d'expérience dans un système de jeu",
    category: "dev",
    relatedTerms: ["gamification"],
  },
  {
    id: "giscus",
    term: "Giscus",
    definition: "Système de commentaires pour sites statiques utilisant les GitHub Discussions. Permet d'ajouter des commentaires sans base de données, en s'appuyant sur l'authentification GitHub.",
    shortDefinition: "Système de commentaires via GitHub",
    category: "dev",
    relatedTerms: ["github"],
  },

  // ===== TERMINAL & CLI =====
  {
    id: "repo",
    term: "Repository (Repo)",
    definition: "Espace de stockage contenant les fichiers d'un projet et leur historique de versions. Un repository peut être local ou hébergé sur une plateforme distante.",
    shortDefinition: "Dépôt de code avec historique de versions",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["github", "branch"],
  },
  {
    id: "branch",
    term: "Branch (Branche)",
    definition: "Ligne de développement indépendante dans un système de contrôle de version. Permet de travailler sur des fonctionnalités isolées sans affecter le code principal.",
    shortDefinition: "Ligne de développement Git indépendante",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["repo", "merge", "push"],
  },
  {
    id: "push",
    term: "Push",
    definition: "Opération Git envoyant les commits locaux vers un repository distant. Synchronise le travail local avec le serveur.",
    shortDefinition: "Envoi des commits vers le serveur distant",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["commit", "pull", "branch"],
  },
  {
    id: "pull",
    term: "Pull",
    definition: "Opération Git récupérant les modifications du repository distant et les intégrant au repository local.",
    shortDefinition: "Récupération des modifications distantes",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["push", "merge"],
  },
  {
    id: "merge",
    term: "Merge (Fusion)",
    definition: "Opération Git intégrant les modifications d'une branche dans une autre. Combine les historiques et peut nécessiter une résolution de conflits.",
    shortDefinition: "Fusion de deux branches Git",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["branch", "pull-request"],
  },
  {
    id: "commit",
    term: "Commit",
    definition: "Instantané enregistré d'un ensemble de modifications dans un système de contrôle de version. Chaque commit possède un identifiant unique et un message descriptif.",
    shortDefinition: "Enregistrement d'un ensemble de modifications",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["push", "branch"],
  },
  {
    id: "deploy",
    term: "Deploy (Déploiement)",
    definition: "Processus de mise en production d'une application. Inclut la compilation, les tests, et la publication sur un serveur accessible aux utilisateurs.",
    shortDefinition: "Mise en production d'une application",
    category: "terminal",
    relatedConcepts: ["vercel"],
    relatedTerms: ["preview"],
  },
  {
    id: "preview",
    term: "Preview (Prévisualisation)",
    definition: "Version temporaire d'une application déployée pour test avant mise en production. Générée automatiquement par certaines plateformes pour chaque branche ou Pull Request.",
    shortDefinition: "Version de test avant production",
    category: "terminal",
    relatedConcepts: ["vercel"],
    relatedTerms: ["deploy", "pull-request"],
  },
  {
    id: "pull-request",
    term: "Pull Request (PR)",
    definition: "Demande de fusion d'une branche dans une autre sur une plateforme Git. Permet la revue de code par les pairs avant intégration. Appelée Merge Request sur GitLab.",
    shortDefinition: "Demande de fusion avec revue de code",
    category: "terminal",
    relatedConcepts: ["git"],
    relatedTerms: ["branch", "merge", "github"],
  },
  {
    id: "cli",
    term: "CLI (Command Line Interface)",
    definition: "Interface permettant d'interagir avec un système via des commandes textuelles. Alternative aux interfaces graphiques, privilégiée pour l'automatisation et les tâches de développement.",
    shortDefinition: "Interface en ligne de commande",
    category: "terminal",
    relatedConcepts: ["claude-code"],
  },

  // ===== GÉNÉRAL =====
  {
    id: "github",
    term: "GitHub",
    definition: "Plateforme d'hébergement de code basée sur Git, propriété de Microsoft. Offre des fonctionnalités collaboratives : Pull Requests, Issues, Actions, Discussions.",
    shortDefinition: "Plateforme d'hébergement de code",
    category: "general",
    relatedConcepts: ["git"],
    relatedTerms: ["repo", "pull-request", "giscus"],
  },
  {
    id: "cloud",
    term: "Cloud",
    definition: "Infrastructure informatique accessible via internet, permettant d'utiliser des ressources (serveurs, stockage, logiciels) sans les posséder physiquement.",
    shortDefinition: "Ressources informatiques accessibles via internet",
    category: "general",
    relatedConcepts: ["vercel"],
  },
  {
    id: "api",
    term: "API (Application Programming Interface)",
    definition: "Interface permettant à des logiciels de communiquer entre eux. Définit les requêtes possibles, les formats de données et les protocoles d'échange.",
    shortDefinition: "Interface de communication entre logiciels",
    category: "general",
  },
  {
    id: "iteration",
    term: "Itération",
    definition: "Cycle de développement répétitif visant l'amélioration progressive. Chaque itération produit une version plus aboutie du produit.",
    shortDefinition: "Cycle d'amélioration progressive",
    category: "general",
  },
  {
    id: "accessibilite",
    term: "Accessibilité (a11y)",
    definition: "Conception d'interfaces utilisables par tous, y compris les personnes en situation de handicap. Inclut le support des lecteurs d'écran, la navigation au clavier et les contrastes adaptés.",
    shortDefinition: "Conception inclusive des interfaces",
    category: "general",
  },
  {
    id: "open-source",
    term: "Open Source",
    definition: "Logiciel dont le code source est public et librement modifiable. Les licences open source définissent les conditions de réutilisation et de distribution.",
    shortDefinition: "Logiciel à code source public et modifiable",
    category: "general",
  },
];

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
