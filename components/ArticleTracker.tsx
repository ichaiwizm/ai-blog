"use client";

import { useEffect, useRef } from "react";
import { useGamification } from "@/contexts/GamificationContext";

interface ArticleTrackerProps {
  slug: string;
  children: React.ReactNode;
}

export default function ArticleTracker({ slug, children }: ArticleTrackerProps) {
  const { recordArticleRead, stats, isLoaded } = useGamification();
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once per page load and after context is loaded
    if (!isLoaded || hasTracked.current) return;

    // Check if article was already read
    if (stats.articlesReadSlugs.includes(slug)) {
      hasTracked.current = true;
      return;
    }

    // Track after user has been on page for a minimum time (10 seconds)
    // This prevents accidental counts from quick bounces
    const timer = setTimeout(() => {
      if (!hasTracked.current) {
        recordArticleRead(slug);
        hasTracked.current = true;
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [slug, recordArticleRead, stats.articlesReadSlugs, isLoaded]);

  return <>{children}</>;
}
