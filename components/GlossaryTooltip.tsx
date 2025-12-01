"use client";

import { getTermByName, GlossaryTerm } from "@/lib/glossary";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

interface GlossaryTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export default function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const glossaryTerm = getTermByName(term);

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const spaceAbove = triggerRect.top;

      if (spaceBelow < tooltipHeight + 20 && spaceAbove > tooltipHeight + 20) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    }
  }, [isOpen]);

  if (!glossaryTerm) {
    return <span>{children || term}</span>;
  }

  return (
    <span className="relative inline-block">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="
          border-b-2 border-dotted border-accent/50
          text-accent cursor-help
          hover:border-accent hover:bg-accent/5
          transition-colors
        "
      >
        {children || term}
      </span>

      {isOpen && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 w-80 max-w-[90vw]
            bg-bg-secondary border-3 border-border shadow-brutal
            animate-scale-up
            ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
            left-1/2 -translate-x-1/2
          `}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Arrow */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 w-3 h-3
              bg-bg-secondary border-border
              ${position === "top"
                ? "bottom-[-7px] border-b-3 border-r-3 rotate-45"
                : "top-[-7px] border-t-3 border-l-3 rotate-45"
              }
            `}
          />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-display text-lg text-text-primary">
                {glossaryTerm.term}
              </h4>
              <span className="text-xs font-mono uppercase tracking-wider text-text-muted bg-bg-tertiary px-2 py-0.5">
                {glossaryTerm.category}
              </span>
            </div>

            {/* Definition */}
            <p className="text-sm text-text-body leading-relaxed">
              {glossaryTerm.shortDefinition}
            </p>

            {/* Examples */}
            {glossaryTerm.examples && glossaryTerm.examples.length > 0 && (
              <div className="mt-3 pt-3 border-t border-border-light">
                <p className="text-xs text-text-muted mb-1">Exemple :</p>
                <code className="text-xs font-mono bg-bg-tertiary px-2 py-1 text-accent">
                  {glossaryTerm.examples[0]}
                </code>
              </div>
            )}

            {/* Link to full definition */}
            <Link
              href={`/glossaire#${glossaryTerm.id}`}
              className="
                inline-flex items-center gap-1 mt-3
                text-xs font-medium text-accent
                hover:underline
              "
              onClick={(e) => e.stopPropagation()}
            >
              Voir la définition complète →
            </Link>
          </div>
        </div>
      )}
    </span>
  );
}

// Component for use in MDX content
export function Term({ children }: { children: string }) {
  return <GlossaryTooltip term={children}>{children}</GlossaryTooltip>;
}
