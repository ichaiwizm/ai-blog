"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

interface SearchBarProps {
  posts: SearchItem[];
}

export default function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fuse = new Fuse(posts, {
    keys: ["title", "description", "tags"],
    threshold: 0.3,
    includeScore: true,
  });

  useEffect(() => {
    if (query.length > 0) {
      const searchResults = fuse.search(query).map((r) => r.item);
      setResults(searchResults.slice(0, 5));
      setIsOpen(true);
      setSelectedIndex(0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      router.push(`/blog/${results[selectedIndex].slug}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Rechercher..."
          className="w-full px-4 py-2 pl-10 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg font-mono text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-[10px] font-mono text-[var(--text-muted)]">
          <span className="text-[8px]">⌘</span>K
        </kbd>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg overflow-hidden shadow-xl z-50">
          {results.map((result, index) => (
            <button
              key={result.slug}
              onClick={() => {
                router.push(`/blog/${result.slug}`);
                setIsOpen(false);
                setQuery("");
              }}
              className={`w-full px-4 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? "bg-[var(--accent-dim)]"
                  : "hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              <div className="font-mono text-sm text-[var(--text-primary)]">
                {result.title}
              </div>
              <div className="font-mono text-xs text-[var(--text-muted)] mt-1 truncate">
                {result.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}
