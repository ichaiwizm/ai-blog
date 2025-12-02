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
  // IA Terms
  {
    id: "llm",
    term: "LLM",
    definition:
      "Large Language Model (Grand Modèle de Langage). Un type de modèle d'intelligence artificielle entraîné sur d'immenses quantités de texte pour comprendre et générer du langage naturel. Exemples : GPT-4, Claude, Llama.",
    shortDefinition: "Grand Modèle de Langage - IA spécialisée dans le texte",
    category: "ia",
    relatedConcepts: ["modeles-ia"],
    relatedTerms: ["prompt", "token", "inference"],
    examples: ["Claude est un LLM développé par Anthropic", "GPT-4 est le LLM derrière ChatGPT"],
  },
  {
    id: "prompt",
    term: "Prompt",
    definition:
      "Instructions ou texte d'entrée fourni à un modèle d'IA pour guider sa réponse. Un bon prompt est clair, spécifique et fournit le contexte nécessaire. L'art de rédiger des prompts efficaces s'appelle le 'prompt engineering'.",
    shortDefinition: "Instructions données à l'IA pour obtenir une réponse",
    category: "ia",
    relatedConcepts: ["modeles-ia"],
    relatedTerms: ["llm", "context-window"],
    examples: [
      "Explique-moi le concept de récursion comme si j'avais 10 ans",
      "Génère une fonction Python qui trie une liste",
    ],
  },
  {
    id: "token",
    term: "Token",
    definition:
      "Unité de base utilisée par les LLM pour traiter le texte. Un token peut être un mot, une partie de mot, ou un caractère de ponctuation. En moyenne, 1 token ≈ 0.75 mot en anglais, ou ~4 caractères.",
    shortDefinition: "Unité de texte traitée par l'IA (~4 caractères)",
    category: "ia",
    relatedTerms: ["llm", "context-window"],
    examples: ["Le mot 'bonjour' = 1-2 tokens", "'ChatGPT' peut être divisé en 'Chat' + 'G' + 'PT'"],
  },
  {
    id: "context-window",
    term: "Fenêtre de contexte",
    definition:
      "Quantité maximale de texte (en tokens) qu'un LLM peut traiter en une seule requête. Plus la fenêtre est grande, plus le modèle peut prendre en compte d'informations. Claude a une fenêtre de 200K tokens.",
    shortDefinition: "Limite de texte que l'IA peut traiter à la fois",
    category: "ia",
    relatedTerms: ["token", "llm"],
  },
  {
    id: "inference",
    term: "Inférence",
    definition:
      "Processus par lequel un modèle d'IA génère une réponse à partir d'une entrée. C'est l'utilisation du modèle après son entraînement, par opposition à la phase d'entraînement elle-même.",
    shortDefinition: "Génération de réponse par l'IA",
    category: "ia",
    relatedTerms: ["llm", "prompt"],
  },
  {
    id: "agent-ia",
    term: "Agent IA",
    definition:
      "Système d'IA capable d'agir de manière autonome pour accomplir des tâches. Contrairement à un simple chatbot, un agent peut utiliser des outils, naviguer sur le web, exécuter du code, et prendre des décisions séquentielles.",
    shortDefinition: "IA autonome capable d'utiliser des outils",
    category: "ia",
    relatedConcepts: ["ia-agentique"],
    relatedTerms: ["llm", "mcp"],
  },
  {
    id: "mcp",
    term: "MCP",
    definition:
      "Model Context Protocol. Protocole standardisé permettant aux LLM de communiquer avec des outils et services externes de manière sécurisée. Développé par Anthropic pour étendre les capacités des agents IA.",
    shortDefinition: "Protocole pour connecter l'IA à des outils externes",
    category: "ia",
    relatedConcepts: ["ia-agentique"],
    relatedTerms: ["agent-ia"],
  },
  {
    id: "fine-tuning",
    term: "Fine-tuning",
    definition:
      "Processus d'adaptation d'un modèle pré-entraîné à une tâche ou domaine spécifique en l'entraînant sur des données supplémentaires ciblées. Plus rapide et moins coûteux que l'entraînement from scratch.",
    shortDefinition: "Spécialisation d'un modèle pour une tâche précise",
    category: "ia",
    relatedTerms: ["llm"],
  },
  {
    id: "hallucination",
    term: "Hallucination",
    definition:
      "Phénomène où un LLM génère des informations fausses ou inventées de manière convaincante. Les hallucinations sont un défi majeur de l'IA générative et nécessitent une vérification humaine.",
    shortDefinition: "Quand l'IA invente des informations fausses",
    category: "ia",
    relatedTerms: ["llm", "inference"],
  },
  {
    id: "rag",
    term: "RAG",
    definition:
      "Retrieval-Augmented Generation. Technique qui combine la recherche d'information (retrieval) avec la génération de texte. Le modèle cherche d'abord des documents pertinents puis génère une réponse basée sur ces sources.",
    shortDefinition: "Génération augmentée par recherche de documents",
    category: "ia",
    relatedTerms: ["llm", "context-window"],
  },

  // Dev Terms
  {
    id: "api",
    term: "API",
    definition:
      "Application Programming Interface. Ensemble de règles et protocoles permettant à différents logiciels de communiquer entre eux. Les API REST et GraphQL sont les plus courantes pour les services web.",
    shortDefinition: "Interface de communication entre logiciels",
    category: "dev",
    examples: ["L'API OpenAI permet d'utiliser GPT dans vos applications", "Une API météo retourne les prévisions"],
  },
  {
    id: "sdk",
    term: "SDK",
    definition:
      "Software Development Kit. Ensemble d'outils, bibliothèques et documentation fournis pour faciliter le développement d'applications sur une plateforme spécifique.",
    shortDefinition: "Kit d'outils pour développer sur une plateforme",
    category: "dev",
    relatedTerms: ["api"],
  },
  {
    id: "repository",
    term: "Repository (Repo)",
    definition:
      "Espace de stockage pour le code source d'un projet, géré par un système de contrôle de version comme Git. Un repo contient l'historique complet des modifications du code.",
    shortDefinition: "Dépôt de code versionné avec Git",
    category: "dev",
    relatedConcepts: ["git-basics"],
    relatedTerms: ["commit", "branch"],
  },
  {
    id: "commit",
    term: "Commit",
    definition:
      "Enregistrement d'un ensemble de modifications dans l'historique Git. Chaque commit a un identifiant unique (hash), un message descriptif, et référence l'état du code à ce moment.",
    shortDefinition: "Sauvegarde de modifications dans Git",
    category: "dev",
    relatedConcepts: ["git-basics"],
    relatedTerms: ["repository", "branch"],
  },
  {
    id: "branch",
    term: "Branch (Branche)",
    definition:
      "Ligne de développement indépendante dans Git. Les branches permettent de travailler sur différentes fonctionnalités en parallèle sans affecter le code principal.",
    shortDefinition: "Ligne de développement parallèle dans Git",
    category: "dev",
    relatedConcepts: ["git-basics"],
    relatedTerms: ["repository", "commit", "merge"],
  },
  {
    id: "merge",
    term: "Merge",
    definition:
      "Opération Git qui combine les modifications de deux branches en une seule. Essentiel pour intégrer le travail de différents développeurs ou fonctionnalités.",
    shortDefinition: "Fusion de deux branches Git",
    category: "dev",
    relatedConcepts: ["git-basics"],
    relatedTerms: ["branch", "commit"],
  },
  {
    id: "ide",
    term: "IDE",
    definition:
      "Integrated Development Environment. Application complète pour le développement logiciel incluant éditeur de code, débogueur, terminal, et outils de build. Exemples : VS Code, JetBrains, Cursor.",
    shortDefinition: "Environnement de développement intégré",
    category: "dev",
    examples: ["VS Code est l'IDE le plus populaire", "Cursor est un IDE avec IA intégrée"],
  },
  {
    id: "framework",
    term: "Framework",
    definition:
      "Structure logicielle réutilisable fournissant une architecture et des composants de base pour développer des applications. Impose souvent des conventions et patterns à suivre.",
    shortDefinition: "Structure de base pour développer des applications",
    category: "dev",
    examples: ["React et Vue.js sont des frameworks frontend", "Django et Rails sont des frameworks backend"],
  },

  // Terminal Terms
  {
    id: "cli",
    term: "CLI",
    definition:
      "Command Line Interface. Interface permettant d'interagir avec un ordinateur via des commandes textuelles. Plus puissant et flexible qu'une interface graphique pour de nombreuses tâches.",
    shortDefinition: "Interface en ligne de commande",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["shell", "bash"],
  },
  {
    id: "shell",
    term: "Shell",
    definition:
      "Programme qui interprète les commandes utilisateur et communique avec le système d'exploitation. Exemples : Bash, Zsh, Fish, PowerShell.",
    shortDefinition: "Interpréteur de commandes",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["cli", "bash"],
  },
  {
    id: "bash",
    term: "Bash",
    definition:
      "Bourne Again SHell. Shell Unix très répandu, par défaut sur de nombreuses distributions Linux et anciennement sur macOS. Permet d'écrire des scripts d'automatisation.",
    shortDefinition: "Shell Unix populaire pour Linux/macOS",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["shell", "cli"],
  },
  {
    id: "path",
    term: "PATH",
    definition:
      "Variable d'environnement contenant la liste des répertoires où le système cherche les programmes exécutables. Modifier le PATH permet d'accéder à des programmes depuis n'importe où.",
    shortDefinition: "Liste des dossiers où chercher les programmes",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["shell", "env-var"],
  },
  {
    id: "env-var",
    term: "Variable d'environnement",
    definition:
      "Variable définie au niveau du système d'exploitation, accessible par tous les programmes. Utilisées pour configurer le comportement des applications sans modifier leur code.",
    shortDefinition: "Configuration système accessible aux programmes",
    category: "terminal",
    relatedTerms: ["path", "shell"],
    examples: ["PATH pour les exécutables", "HOME pour le dossier utilisateur", "API_KEY pour les secrets"],
  },
  {
    id: "sudo",
    term: "sudo",
    definition:
      "Super User DO. Commande Unix permettant d'exécuter une autre commande avec les privilèges administrateur (root). Nécessite généralement un mot de passe.",
    shortDefinition: "Exécuter une commande en administrateur",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["shell", "cli"],
  },
  {
    id: "pipe",
    term: "Pipe (|)",
    definition:
      "Opérateur qui redirige la sortie d'une commande vers l'entrée d'une autre. Permet de chaîner des commandes pour créer des workflows puissants.",
    shortDefinition: "Chaîner des commandes ensemble",
    category: "terminal",
    relatedConcepts: ["terminal-basics"],
    relatedTerms: ["shell", "cli"],
    examples: ["ls | grep '.txt'", "cat file.txt | wc -l"],
  },

  // General Terms
  {
    id: "open-source",
    term: "Open Source",
    definition:
      "Logiciel dont le code source est publiquement accessible, modifiable et redistribuable. Favorise la collaboration et la transparence. Exemples : Linux, Firefox, VS Code.",
    shortDefinition: "Code accessible et modifiable par tous",
    category: "general",
  },
  {
    id: "markdown",
    term: "Markdown",
    definition:
      "Langage de balisage léger permettant de formater du texte de manière simple et lisible. Très utilisé pour la documentation, README, et notes. Fichiers en .md.",
    shortDefinition: "Format simple pour écrire du texte formaté",
    category: "general",
    examples: ["# Titre", "**gras**", "- liste à puces", "[lien](url)"],
  },
  {
    id: "json",
    term: "JSON",
    definition:
      "JavaScript Object Notation. Format de données textuel, léger et lisible, très utilisé pour les API et la configuration. Basé sur les objets et tableaux JavaScript.",
    shortDefinition: "Format de données structuré et lisible",
    category: "general",
    relatedTerms: ["api"],
    examples: ['{"nom": "Claude", "version": 3}'],
  },
  {
    id: "yaml",
    term: "YAML",
    definition:
      "YAML Ain't Markup Language. Format de sérialisation de données lisible par l'humain, souvent utilisé pour les fichiers de configuration. Plus lisible que JSON pour les structures complexes.",
    shortDefinition: "Format de configuration lisible",
    category: "general",
    examples: ["nom: Claude\\nversion: 3"],
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
