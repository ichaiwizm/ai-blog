"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Post } from "@/lib/posts";
import { Concept } from "@/lib/concepts-types";
import { ArticleIcon, IconByName } from "@/components/icons";

interface SearchAdvancedProps {
  posts: Post[];
  concepts: Concept[];
}

type ContentType = "all" | "posts" | "concepts";
type Level = "all" | "debutant" | "intermediaire" | "avance";
type Category = "all" | "tutoriels" | "actualites" | "opinions" | "comparatifs";

interface SearchResult {
  type: "post" | "concept";
  item: Post | Concept;
  score: number;
}

export default function SearchAdvanced({ posts, concepts }: SearchAdvancedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [contentType, setContentType] = useState<ContentType>("all");
  const [level, setLevel] = useState<Level>("all");
  const [category, setCategory] = useState<Category>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recent-searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch {
        // Invalid data
      }
    }
  }, []);

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fuse.js search instances
  const postsFuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "description", "tags", "category"],
        threshold: 0.4,
        includeScore: true,
      }),
    [posts]
  );

  const conceptsFuse = useMemo(
    () =>
      new Fuse(concepts, {
        keys: ["title", "description", "level"],
        threshold: 0.4,
        includeScore: true,
      }),
    [concepts]
  );

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    let searchResults: SearchResult[] = [];

    // Search posts
    if (contentType === "all" || contentType === "posts") {
      const postResults = postsFuse.search(query);
      searchResults.push(
        ...postResults.map((r) => ({
          type: "post" as const,
          item: r.item,
          score: r.score || 0,
        }))
      );
    }

    // Search concepts
    if (contentType === "all" || contentType === "concepts") {
      const conceptResults = conceptsFuse.search(query);
      searchResults.push(
        ...conceptResults.map((r) => ({
          type: "concept" as const,
          item: r.item,
          score: r.score || 0,
        }))
      );
    }

    // Apply filters
    searchResults = searchResults.filter((result) => {
      // Level filter (for concepts)
      if (level !== "all" && result.type === "concept") {
        const concept = result.item as Concept;
        if (concept.level !== level) return false;
      }

      // Category filter (for posts)
      if (category !== "all" && result.type === "post") {
        const post = result.item as Post;
        if (post.category !== category) return false;
      }

      return true;
    });

    // Sort by score
    searchResults.sort((a, b) => a.score - b.score);

    return searchResults.slice(0, 10);
  }, [query, contentType, level, category, postsFuse, conceptsFuse]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selected = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recent-searches", JSON.stringify(newRecent));

    setIsOpen(false);
    setQuery("");
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent-searches");
  };

  const levelLabels = {
    all: "Tous niveaux",
    debutant: "Débutant",
    intermediaire: "Intermédiaire",
    avance: "Avancé",
  };

  const categoryLabels = {
    all: "Toutes catégories",
    tutoriels: "Tutoriels",
    actualites: "Actualités",
    opinions: "Opinions",
    comparatifs: "Comparatifs",
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="
          flex items-center gap-3 px-4 py-2.5
          bg-bg-secondary border-3 border-border
          text-text-muted text-sm
          transition-all duration-200
          hover:translate-x-[-2px] hover:translate-y-[-2px]
          hover:shadow-brutal
          w-full max-w-md
        "
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <span className="flex-1 text-left">Rechercher...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-bg-tertiary border border-border-light text-xs font-mono">
          <span>⌘</span>K
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Search modal */}
      <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div className="bg-bg-secondary border-3 border-border shadow-brutal-lg">
          {/* Search input */}
          <div className="p-4 border-b-3 border-border">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-text-muted shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Rechercher articles, concepts..."
                className="flex-1 bg-transparent text-text-primary text-lg outline-none placeholder:text-text-muted"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary"
              >
                <kbd className="px-2 py-0.5 bg-bg-tertiary border border-border-light text-xs font-mono">
                  ESC
                </kbd>
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Content type */}
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="px-3 py-1.5 bg-bg-tertiary border-2 border-border-light text-sm text-text-body outline-none focus:border-accent"
              >
                <option value="all">Tout</option>
                <option value="posts">Articles</option>
                <option value="concepts">Concepts</option>
              </select>

              {/* Level filter */}
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="px-3 py-1.5 bg-bg-tertiary border-2 border-border-light text-sm text-text-body outline-none focus:border-accent"
              >
                {Object.entries(levelLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              {/* Category filter */}
              {(contentType === "all" || contentType === "posts") && (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="px-3 py-1.5 bg-bg-tertiary border-2 border-border-light text-sm text-text-body outline-none focus:border-accent"
                >
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Results */}
          <div
            ref={resultsRef}
            className="max-h-96 overflow-y-auto"
          >
            {query.trim() === "" ? (
              // Recent searches
              <div className="p-4">
                {recentSearches.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-text-muted">
                        Recherches récentes
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-text-muted hover:text-accent"
                      >
                        Effacer
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-left text-text-body hover:bg-bg-tertiary"
                      >
                        <span className="text-text-muted">↩</span>
                        {search}
                      </button>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-text-muted py-8">
                    Commencez à taper pour rechercher...
                  </p>
                )}
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-muted">
                  Aucun résultat pour &quot;{query}&quot;
                </p>
              </div>
            ) : (
              results.map((result, index) => {
                const isPost = result.type === "post";
                const item = result.item;
                const href = isPost ? `/blog/${item.slug}` : `/concepts/${item.slug}`;

                return (
                  <Link
                    key={`${result.type}-${item.slug}`}
                    href={href}
                    onClick={() => handleSelect(result)}
                    className={`
                      flex items-start gap-3 p-4 border-b border-border-light
                      transition-colors
                      ${index === selectedIndex ? "bg-accent/10" : "hover:bg-bg-tertiary"}
                    `}
                  >
                    {/* Type indicator */}
                    <span
                      className={`
                        shrink-0 w-8 h-8 flex items-center justify-center
                        border-2
                        ${isPost
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        }
                      `}
                    >
                      {isPost ? <ArticleIcon size={16} /> : <IconByName name={(item as Concept).icon || "books"} size={16} />}
                    </span>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-primary truncate">
                        {item.title}
                      </h4>
                      <p className="text-sm text-text-muted truncate">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono uppercase tracking-wider text-text-muted">
                          {isPost ? (item as Post).category : (item as Concept).level}
                        </span>
                        {isPost && (item as Post).tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-1.5 py-0.5 bg-bg-tertiary text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Enter hint for selected */}
                    {index === selectedIndex && (
                      <kbd className="shrink-0 px-2 py-0.5 bg-bg-tertiary border border-border-light text-xs font-mono text-text-muted">
                        ↵
                      </kbd>
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-bg-tertiary border-t border-border-light flex items-center justify-between text-xs text-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-bg-secondary border border-border-light">↑</kbd>
                <kbd className="px-1 py-0.5 bg-bg-secondary border border-border-light">↓</kbd>
                naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-bg-secondary border border-border-light">↵</kbd>
                ouvrir
              </span>
            </div>
            <span>{results.length} résultat{results.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </div>
    </>
  );
}
