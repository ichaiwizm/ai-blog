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
        rootMargin: "-100px 0px -80% 0px",
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
    <nav className="hidden lg:block fixed right-4 xl:right-8 top-32 w-56 xl:w-64 max-h-[calc(100vh-10rem)] overflow-y-auto">
      <div className="border-3 border-border bg-bg-secondary p-4 xl:p-5">
        <h4 className="font-body text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">
          Sommaire
        </h4>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={`block font-body text-sm py-1.5 transition-all border-l-3 pl-3 -ml-px ${
                  activeId === heading.id
                    ? "text-accent border-accent font-medium"
                    : "text-text-muted border-transparent hover:text-text-primary hover:border-border-light"
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
