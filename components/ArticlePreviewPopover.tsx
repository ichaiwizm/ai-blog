"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface ArticlePreviewData {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
  tags: string[];
  category?: string;
  image?: string;
}

interface ArticlePreviewPopoverProps {
  slug: string;
  children: React.ReactNode;
}

// Cache for article previews
const previewCache = new Map<string, ArticlePreviewData>();

export default function ArticlePreviewPopover({
  slug,
  children,
}: ArticlePreviewPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [preview, setPreview] = useState<ArticlePreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");

  const triggerRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !popoverRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 280; // Approximate height
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    setPosition(spaceBelow < popoverHeight && spaceAbove > spaceBelow ? "top" : "bottom");
  }, []);

  const fetchPreview = useCallback(async () => {
    // Check cache first
    if (previewCache.has(slug)) {
      setPreview(previewCache.get(slug)!);
      return;
    }

    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch(`/api/articles/${slug}/preview`);
      if (!res.ok) throw new Error("Not found");

      const data = await res.json();
      previewCache.set(slug, data);
      setPreview(data);
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  const handleMouseEnter = useCallback(() => {
    // Clear any existing hide timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Delay showing to avoid accidental triggers
    fetchTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      fetchPreview();
    }, 200);
  }, [fetchPreview]);

  const handleMouseLeave = useCallback(() => {
    // Clear fetch timeout if user leaves quickly
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Delay hiding so user can move to popover
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 150);
  }, []);

  const handlePopoverMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const handlePopoverMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  return (
    <span className="article-ref-wrapper">
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="article-ref-trigger"
      >
        <Link href={`/blog/${slug}`} className="article-ref-link">
          {children}
        </Link>
      </span>

      {isVisible && (
        <div
          ref={popoverRef}
          onMouseEnter={handlePopoverMouseEnter}
          onMouseLeave={handlePopoverMouseLeave}
          className={`article-preview-popover ${position}`}
          role="tooltip"
        >
          {/* Arrow */}
          <div className={`article-preview-arrow ${position}`} />

          {/* Content */}
          <div className="article-preview-content">
            {isLoading && (
              <div className="article-preview-loading">
                <div className="loading-bar" />
                <span>Chargement...</span>
              </div>
            )}

            {error && (
              <div className="article-preview-error">
                <span className="error-icon">!</span>
                <span>Article introuvable</span>
              </div>
            )}

            {preview && !isLoading && !error && (
              <>
                {/* Category Badge */}
                {preview.category && (
                  <span className="preview-category">
                    {preview.category}
                  </span>
                )}

                {/* Title */}
                <h4 className="preview-title">
                  <Link href={`/blog/${slug}`}>
                    {preview.title}
                  </Link>
                </h4>

                {/* Description */}
                <p className="preview-description">
                  {preview.description}
                </p>

                {/* Meta */}
                <div className="preview-meta">
                  <span className="preview-date">
                    {new Date(preview.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="preview-separator">/</span>
                  <span className="preview-reading-time">
                    {preview.readingTime}
                  </span>
                </div>

                {/* Tags */}
                {preview.tags.length > 0 && (
                  <div className="preview-tags">
                    {preview.tags.map((tag) => (
                      <span key={tag} className="preview-tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer action */}
                <div className="preview-footer">
                  <Link href={`/blog/${slug}`} className="preview-read-more">
                    Lire l'article
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
