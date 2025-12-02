"use client";

import { useFavorites, FavoriteItem } from "@/contexts/FavoritesContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { HeartIcon, ArticleIcon, BooksIcon } from "@/components/icons";

export default function FavorisPage() {
  const { favorites, getFavoritesByType, isLoaded } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<"all" | "post" | "concept">("all");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isLoaded) {
    return (
      <div className="container-default py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-12 w-64 bg-bg-tertiary" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-bg-tertiary border-3 border-border-light" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredFavorites = filter === "all"
    ? favorites
    : getFavoritesByType(filter);

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    const dateA = new Date(a.addedAt).getTime();
    const dateB = new Date(b.addedAt).getTime();
    return sortBy === "recent" ? dateB - dateA : dateA - dateB;
  });

  const postCount = getFavoritesByType("post").length;
  const conceptCount = getFavoritesByType("concept").length;

  return (
    <div className="container-default py-8 sm:py-10 md:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-10 md:mb-12 animate-fade-up">
        <span className="inline-block px-2 sm:px-3 py-1 bg-rose-500 text-white text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-3 sm:mb-4">
          Ma Liste
        </span>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-primary mb-3 sm:mb-4">
          Mes Favoris
        </h1>
        <p className="text-base sm:text-lg text-text-muted max-w-2xl">
          Retrouvez tous les articles et concepts que vous avez sauvegardés pour les lire plus tard.
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 animate-fade-up">
          <div className="flex justify-center text-text-muted mb-4"><HeartIcon size={64} /></div>
          <h2 className="font-display text-2xl text-text-primary mb-2">
            Aucun favori pour l'instant
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            Cliquez sur le cœur sur n'importe quel article ou concept pour l'ajouter à vos favoris.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/blog" className="brutal-btn">
              Explorer les articles
            </Link>
            <Link href="/concepts" className="brutal-btn-secondary">
              Voir les concepts
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 animate-fade-up stagger-1">
            <div className="bg-bg-secondary border-3 border-border p-3 sm:p-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-text-primary">
                {favorites.length}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-text-muted">Total favoris</div>
            </div>
            <div className="bg-bg-secondary border-3 border-border p-3 sm:p-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-accent">
                {postCount}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-text-muted">Articles</div>
            </div>
            <div className="bg-bg-secondary border-3 border-border p-3 sm:p-4">
              <div className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {conceptCount}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-text-muted">Concepts</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 animate-fade-up stagger-2">
            {/* Type filter */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`
                  px-3 sm:px-4 py-2 border-2 text-xs sm:text-sm font-medium transition-all touch-target
                  ${filter === "all"
                    ? "bg-accent border-accent text-white"
                    : "bg-bg-secondary border-border hover:border-accent"
                  }
                `}
              >
                Tous ({favorites.length})
              </button>
              <button
                onClick={() => setFilter("post")}
                className={`
                  px-3 sm:px-4 py-2 border-2 text-xs sm:text-sm font-medium transition-all touch-target flex items-center gap-1
                  ${filter === "post"
                    ? "bg-accent border-accent text-white"
                    : "bg-bg-secondary border-border hover:border-accent"
                  }
                `}
              >
                <ArticleIcon size={14} /> <span className="hidden xs:inline">Articles</span> ({postCount})
              </button>
              <button
                onClick={() => setFilter("concept")}
                className={`
                  px-3 sm:px-4 py-2 border-2 text-xs sm:text-sm font-medium transition-all touch-target flex items-center gap-1
                  ${filter === "concept"
                    ? "bg-accent border-accent text-white"
                    : "bg-bg-secondary border-border hover:border-accent"
                  }
                `}
              >
                <BooksIcon size={14} /> <span className="hidden xs:inline">Concepts</span> ({conceptCount})
              </button>
            </div>

            {/* Sort */}
            <div className="sm:ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "recent" | "oldest")}
                className="px-4 py-2 bg-bg-secondary border-3 border-border text-sm outline-none focus:border-accent"
              >
                <option value="recent">Plus récents</option>
                <option value="oldest">Plus anciens</option>
              </select>
            </div>
          </div>

          {/* Favorites list */}
          {sortedFavorites.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-text-muted text-sm sm:text-base">
                Aucun {filter === "post" ? "article" : "concept"} dans vos favoris.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 animate-fade-up stagger-3">
              {sortedFavorites.map((favorite) => (
                <FavoriteCard key={favorite.slug} favorite={favorite} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function FavoriteCard({ favorite }: { favorite: FavoriteItem }) {
  const isPost = favorite.type === "post";
  const href = isPost ? `/blog/${favorite.slug}` : `/concepts/${favorite.slug}`;
  const formattedDate = new Date(favorite.addedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="group relative bg-bg-secondary border-3 border-border transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal">
      <Link href={href} className="block p-4 sm:p-5 md:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Type indicator */}
          <div
            className={`
              w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shrink-0 border-2
              ${isPost
                ? "bg-accent/10 border-accent text-accent"
                : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400"
              }
            `}
          >
            {isPost ? <ArticleIcon size={24} /> : <BooksIcon size={24} />}
          </div>

          <div className="flex-1 min-w-0 pr-8 sm:pr-10">
            <span
              className={`
                text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 border font-mono uppercase
                ${isPost
                  ? "bg-accent/10 border-accent text-accent"
                  : "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 text-emerald-600 dark:text-emerald-400"
                }
              `}
            >
              {isPost ? "Article" : "Concept"}
            </span>
            <h3 className="font-semibold text-base sm:text-lg text-text-primary mt-1.5 sm:mt-2 group-hover:text-accent transition-colors truncate">
              {favorite.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Ajouté le {formattedDate}
            </p>
          </div>

          {/* Arrow */}
          <div className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all self-center hidden sm:block">
            →
          </div>
        </div>
      </Link>

      {/* Remove button */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <FavoriteButton slug={favorite.slug} type={favorite.type} size="sm" />
      </div>
    </div>
  );
}
