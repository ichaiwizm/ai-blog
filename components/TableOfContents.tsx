"use client";

import { useEffect, useState } from "react";
import { TocHeading } from "@/lib/posts";

interface TableOfContentsProps {
  headings: TocHeading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
        threshold: 0,
      }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block fixed right-8 top-32 w-64 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="font-mono text-xs text-[var(--text-muted)] mb-4 uppercase tracking-wider">
        <span className="text-[var(--accent)]">&gt;</span> Sommaire
      </div>
      <ul className="space-y-2 border-l border-[var(--border)]">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12 + 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block font-mono text-xs py-1 transition-colors border-l-2 -ml-[1px] pl-3 ${
                activeId === heading.id
                  ? "text-[var(--accent)] border-[var(--accent)]"
                  : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
