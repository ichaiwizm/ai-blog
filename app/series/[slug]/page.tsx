import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const series = getAllSeries();
  return series.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const series = getAllSeries().find((s) => s.slug === params.slug);

  if (!series) {
    return { title: "Serie non trouvee" };
  }

  return {
    title: `${series.title} - AI Blog`,
    description: `Serie de ${series.posts.length} articles sur ${series.title}`,
  };
}

export default function SeriesDetailPage({ params }: Props) {
  const allSeries = getAllSeries();
  const series = allSeries.find((s) => s.slug === params.slug);

  if (!series) {
    notFound();
  }

  const posts = getPostsBySeries(params.slug);

  return (
    <main className="min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: "Accueil", href: "/" },
              { label: "Series", href: "/series" },
              { label: series.title },
            ]}
          />
        </div>

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-[var(--border)]">
          <div className="font-mono text-xs text-[var(--text-muted)] mb-4">
            <span className="text-[var(--accent)]">&gt;</span> Serie
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            {series.title}
          </h1>
          <div className="flex items-center gap-4 font-mono text-sm text-[var(--text-muted)]">
            <span>{posts.length} article{posts.length !== 1 ? "s" : ""}</span>
            <span>·</span>
            <span>
              ~{posts.reduce((acc, post) => {
                const minutes = parseInt(post.readingTime) || 5;
                return acc + minutes;
              }, 0)} min de lecture
            </span>
          </div>
        </header>

        {/* Progress indicator */}
        <div className="mb-8 p-4 rounded border border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="font-mono text-xs text-[var(--text-muted)] mb-3">
            <span className="text-[var(--accent)]">&gt;</span> Progression
          </div>
          <div className="flex items-center gap-2">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex-1 h-2 rounded-full bg-[var(--border)] hover:bg-[var(--accent)] transition-colors relative"
                title={post.title}
              >
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-[var(--bg-tertiary)] px-2 py-1 rounded">
                  {index + 1}. {post.title.slice(0, 30)}...
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-4 p-4 rounded border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--accent-dim)] border border-[var(--accent)] flex items-center justify-center font-mono text-sm text-[var(--accent)]">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-mono text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors mb-1">
                  {post.title}
                </h2>
                <p className="font-serif text-sm text-[var(--text-muted)] line-clamp-2 mb-2">
                  {post.description}
                </p>
                <div className="font-mono text-xs text-[var(--text-muted)]">
                  {post.readingTime}
                </div>
              </div>
              <svg
                className="flex-shrink-0 w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Other series */}
        {allSeries.length > 1 && (
          <section className="mt-16 pt-8 border-t border-[var(--border)]">
            <h2 className="font-mono text-lg font-bold text-[var(--text-primary)] mb-6">
              <span className="text-[var(--accent)]">&gt;</span> Autres series
            </h2>
            <div className="flex flex-wrap gap-2">
              {allSeries
                .filter((s) => s.slug !== params.slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/series/${s.slug}`}
                    className="px-4 py-2 rounded border border-[var(--border)] font-mono text-xs text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    {s.title} ({s.posts.length})
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
