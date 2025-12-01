import Link from "next/link";
import { getAllSeries } from "@/lib/posts";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata = {
  title: "Series - AI Blog",
  description:
    "Explorez nos series d'articles sur l'intelligence artificielle",
};

export default function SeriesPage() {
  const series = getAllSeries();

  return (
    <>
      {/* Header */}
      <section className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-16">
          {/* Breadcrumbs */}
          <div className="mb-8 animate-fade-up">
            <Breadcrumbs
              items={[{ label: "Accueil", href: "/" }, { label: "Series" }]}
            />
          </div>

          <div className="animate-fade-up stagger-1">
            <span className="category-badge mb-6 inline-block">
              {series.length} serie{series.length !== 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-6 animate-fade-up stagger-2">
            Series d&apos;articles
          </h1>

          <p className="text-xl text-text-muted max-w-xl animate-fade-up stagger-3">
            Des collections d&apos;articles pour approfondir un sujet pas a pas.
          </p>
        </div>
      </section>

      {/* Series list */}
      <section className="py-16">
        <div className="container-default">
          {series.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2">
              {series.map((s, index) => (
                <Link
                  key={s.slug}
                  href={`/series/${s.slug}`}
                  className="group block border-3 border-border bg-bg-secondary p-6 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-accent border-2 border-border flex items-center justify-center">
                      <span className="font-mono text-sm font-bold text-text-inverse">
                        {s.posts.length}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                      article{s.posts.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <h2 className="font-display text-2xl text-text-primary group-hover:text-accent transition-colors mb-4">
                    {s.title}
                  </h2>

                  <div className="space-y-2 border-t-2 border-border-light pt-4">
                    {s.posts.slice(0, 3).map((post, i) => (
                      <div
                        key={post.slug}
                        className="flex items-center gap-3 text-sm text-text-muted"
                      >
                        <span className="font-mono text-xs w-5 h-5 flex items-center justify-center border border-border-light">
                          {i + 1}
                        </span>
                        <span className="truncate">{post.title}</span>
                      </div>
                    ))}
                    {s.posts.length > 3 && (
                      <div className="font-mono text-xs text-accent pl-8">
                        + {s.posts.length - 3} autres articles
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-3 border-border-light">
              <p className="font-body text-text-muted text-lg mb-4">
                Aucune serie disponible pour le moment.
              </p>
              <Link href="/blog" className="brutal-btn-secondary">
                Voir tous les articles
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
