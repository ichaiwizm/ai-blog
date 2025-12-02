"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface ExploreDropdownProps {
  pathname: string;
}

export function ExploreDropdown({ pathname }: ExploreDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = pathname.startsWith("/parcours") ||
                   pathname.startsWith("/glossaire") ||
                   pathname.startsWith("/series");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    { href: "/parcours", label: "Parcours", desc: "Chemins d'apprentissage" },
    { href: "/glossaire", label: "Glossaire", desc: "Définitions clés" },
    { href: "/series", label: "Séries", desc: "Articles liés" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 lg:px-4 py-2 font-body text-sm font-semibold uppercase tracking-wide
          border-b-3 transition-all duration-150 flex items-center gap-1
          ${isActive
            ? "text-text-primary border-accent"
            : "text-text-muted border-transparent hover:text-text-primary hover:border-border"
          }
        `}
      >
        Explorer
        <ChevronDownIcon size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-3 border-b-2 border-border-light last:border-b-0
                transition-colors hover:bg-bg-tertiary
                ${pathname.startsWith(item.href) ? "bg-accent/10" : ""}
              `}
            >
              <span className="block font-body font-semibold text-sm text-text-primary">
                {item.label}
              </span>
              <span className="block font-mono text-xs text-text-muted mt-0.5">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
