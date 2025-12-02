"use client";

import { useEffect, useState, ReactNode } from "react";
import { HeartFilledIcon, RocketIcon, LightbulbIcon, ClapIcon } from "@/components/icons";

interface ReactionsProps {
  slug: string;
}

interface ReactionConfig {
  icon: ReactNode;
  label: string;
  key: string;
  activeColor: string;
}

const REACTIONS: ReactionConfig[] = [
  { icon: <HeartFilledIcon size={20} />, label: "J'aime", key: "heart", activeColor: "text-rose-500" },
  { icon: <RocketIcon size={20} />, label: "Utile", key: "rocket", activeColor: "text-blue-500" },
  { icon: <LightbulbIcon size={20} />, label: "Instructif", key: "bulb", activeColor: "text-amber-500" },
  { icon: <ClapIcon size={20} />, label: "Bravo", key: "clap", activeColor: "text-emerald-500" },
];

type ReactionKey = "heart" | "rocket" | "bulb" | "clap";

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
        {activeCount > 0 ? "Merci pour votre réaction !" : "Cet article vous a plu ?"}
      </span>
      <div className="flex items-center gap-3">
        {REACTIONS.map(({ icon, label, key, activeColor }) => (
          <button
            key={key}
            onClick={() => toggleReaction(key as ReactionKey)}
            className={`group relative w-14 h-14 flex items-center justify-center border-3 transition-all duration-200 ${
              reactions[key as ReactionKey]
                ? `border-accent bg-accent-light translate-x-[-2px] translate-y-[-2px] shadow-brutal-sm-accent ${activeColor}`
                : "border-border bg-bg-secondary hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm text-text-muted hover:text-text-primary"
            }`}
            aria-label={label}
            title={label}
          >
            <span className="transition-transform group-hover:scale-110">
              {icon}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
