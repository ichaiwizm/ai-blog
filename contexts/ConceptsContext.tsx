"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ConceptsContextType {
  completedConcepts: Set<string>;
  markAsCompleted: (slug: string) => void;
  markAsIncomplete: (slug: string) => void;
  isCompleted: (slug: string) => boolean;
  isLoaded: boolean;
}

const ConceptsContext = createContext<ConceptsContextType | undefined>(undefined);

const STORAGE_KEY = "completed-concepts";

export function ConceptsProvider({ children }: { children: ReactNode }) {
  const [completedConcepts, setCompletedConcepts] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCompletedConcepts(new Set(parsed));
      } catch {
        // Invalid data, reset
        setCompletedConcepts(new Set());
      }
    }
    setIsLoaded(true);
  }, []);

  const saveToStorage = (concepts: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(concepts)));
  };

  const markAsCompleted = (slug: string) => {
    setCompletedConcepts((prev) => {
      const next = new Set(prev);
      next.add(slug);
      saveToStorage(next);
      return next;
    });
  };

  const markAsIncomplete = (slug: string) => {
    setCompletedConcepts((prev) => {
      const next = new Set(prev);
      next.delete(slug);
      saveToStorage(next);
      return next;
    });
  };

  const isCompleted = (slug: string) => completedConcepts.has(slug);

  return (
    <ConceptsContext.Provider
      value={{ completedConcepts, markAsCompleted, markAsIncomplete, isCompleted, isLoaded }}
    >
      {children}
    </ConceptsContext.Provider>
  );
}

export function useConcepts() {
  const context = useContext(ConceptsContext);
  if (context === undefined) {
    throw new Error("useConcepts must be used within a ConceptsProvider");
  }
  return context;
}
