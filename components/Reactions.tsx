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
    <div className="flex flex-col items-center gap-4 py-8">
      <span className="font-body text-sm text-text-muted">
        {activeCount > 0 ? "Merci pour votre reaction !" : "Cet article vous a plu ?"}
      </span>
      <div className="flex items-center gap-3">
        {REACTIONS.map(({ emoji, label, key }) => (
          <button
            key={key}
            onClick={() => toggleReaction(key)}
            className={`group relative w-14 h-14 flex items-center justify-center border-3 transition-all duration-200 ${
              reactions[key]
                ? "border-accent bg-accent-light translate-x-[-2px] translate-y-[-2px] shadow-brutal-sm-accent"
                : "border-border bg-bg-secondary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
            }`}
            aria-label={label}
            title={label}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">
              {emoji}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
