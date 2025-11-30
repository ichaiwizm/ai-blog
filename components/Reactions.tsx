"use client";

import { useEffect, useState } from "react";

interface ReactionsProps {
  slug: string;
}

const REACTIONS = [
  { emoji: "❤️", label: "J'aime", key: "heart" },
  { emoji: "🚀", label: "Utile", key: "rocket" },
  { emoji: "💡", label: "Instructif", key: "bulb" },
  { emoji: "👏", label: "Bravo", key: "clap" },
] as const;

type ReactionKey = (typeof REACTIONS)[number]["key"];

export default function Reactions({ slug }: ReactionsProps) {
  const [reactions, setReactions] = useState<Record<ReactionKey, boolean>>({
    heart: false,
    rocket: false,
    bulb: false,
    clap: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem(`reactions-${slug}`);
    if (stored) {
      try {
        setReactions(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [slug]);

  const toggleReaction = (key: ReactionKey) => {
    const newReactions = { ...reactions, [key]: !reactions[key] };
    setReactions(newReactions);
    localStorage.setItem(`reactions-${slug}`, JSON.stringify(newReactions));
  };

  const activeCount = Object.values(reactions).filter(Boolean).length;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <span className="font-mono text-xs text-[var(--text-muted)]">
        {activeCount > 0 ? "Merci pour votre reaction !" : "Cet article vous a plu ?"}
      </span>
      <div className="flex items-center gap-2">
        {REACTIONS.map(({ emoji, label, key }) => (
          <button
            key={key}
            onClick={() => toggleReaction(key)}
            className={`group relative p-3 rounded-lg border transition-all duration-200 ${
              reactions[key]
                ? "border-[var(--accent)] bg-[var(--accent-dim)] scale-110"
                : "border-[var(--border)] hover:border-[var(--border-hover)] hover:scale-105"
            }`}
            aria-label={label}
            title={label}
          >
            <span className="text-xl">{emoji}</span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
