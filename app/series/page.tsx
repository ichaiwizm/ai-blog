import Link from "next/link";
import { getAllSeries } from "@/lib/posts";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Series - AI Blog",
  description: "Explorez nos series d'articles sur l'intelligence artificielle",
};

export default function SeriesPage() {
  const series = getAllSeries();

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Series" },
            ]}
          />
        </div>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-[var(--border)]">
          <div className="font-mono text-xs text-[var(--text-muted)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> ls series/
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Series d'articles
          </h1>
          <p className="font-serif text-lg text-[var(--text-secondary)]">
            Des collections d'articles pour approfondir un sujet pas a pas.
          </p>
        </header>

        {/* Series list */}
        {series.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {series.map((s, index) => (
              <Link
                key={s.slug}
                href={`/series/${s.slug}`}
                className="group block p-6 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="font-mono text-xs text-[var(--accent)] mb-2">
                  {s.posts.length} article{s.posts.length !== 1 ? "s" : ""}
                </div>
                <h2 className="font-mono text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-3">
                  {s.title}
                </h2>
                <div className="space-y-1">
                  {s.posts.slice(0, 3).map((post, i) => (
                    <div
                      key={post.slug}
                      className="font-mono text-xs text-[var(--text-muted)] truncate"
                    >
                      {i + 1}. {post.title}
                    </div>
                  ))}
                  {s.posts.length > 3 && (
                    <div className="font-mono text-xs text-[var(--text-muted)]">
                      + {s.posts.length - 3} autres...
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-mono text-[var(--text-muted)]">
              Aucune serie disponible pour le moment.
            </p>
            <Link
              href="/blog"
              className="inline-block mt-4 font-mono text-sm text-[var(--accent)] hover:underline"
            >
              Voir tous les articles
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
