import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";
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
  const totalReadingTime = posts.reduce((acc, post) => {
    const minutes = parseInt(post.readingTime) || 5;
    return acc + minutes;
  }, 0);

  return (
    <>
      {/* Header */}
      <section className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-16">
          {/* Breadcrumbs */}
          <div className="mb-8 animate-fade-up">
            <Breadcrumbs
              items={[
                { label: "Accueil", href: "/" },
                { label: "Series", href: "/series" },
                { label: series.title },
              ]}
            />
          </div>

          <div className="animate-fade-up stagger-1">
            <span className="category-badge mb-6 inline-block">Serie</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-6 animate-fade-up stagger-2">
            {series.title}
          </h1>

          <div className="flex items-center gap-6 font-mono text-sm text-text-muted animate-fade-up stagger-3">
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 bg-accent flex items-center justify-center text-text-inverse text-xs font-bold">
                {posts.length}
              </span>
              article{posts.length !== 1 ? "s" : ""}
            </span>
            <span className="w-1 h-1 bg-border-light rounded-full" />
            <span>~{totalReadingTime} min de lecture</span>
          </div>
        </div>
      </section>

      {/* Progress indicator */}
      <section className="border-b-3 border-border-light py-6">
        <div className="container-default">
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Progression
            </span>
            <div className="flex-1 flex items-center gap-1">
              {posts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex-1 h-2 bg-border-light hover:bg-accent transition-colors relative"
                  title={post.title}
                >
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 font-mono text-xs text-text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-bg-secondary border-2 border-border px-3 py-1.5 z-10">
                    {index + 1}. {post.title.slice(0, 25)}
                    {post.title.length > 25 ? "..." : ""}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container-default">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-6 border-3 border-border bg-bg-secondary p-6 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-shrink-0 w-12 h-12 bg-accent-light border-3 border-accent flex items-center justify-center font-display text-xl text-accent">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-xl text-text-primary group-hover:text-accent transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-text-muted line-clamp-2 mb-3">
                    {post.description}
                  </p>
                  <div className="font-mono text-xs text-text-muted">
                    {post.readingTime}
                  </div>
                </div>
                <svg
                  className="flex-shrink-0 w-6 h-6 text-text-muted group-hover:text-accent transition-colors mt-2"
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
        </div>
      </section>

      {/* Other series */}
      {allSeries.length > 1 && (
        <section className="py-16 border-t-3 border-border">
          <div className="container-default">
            <h2 className="font-display text-2xl text-text-primary mb-8">
              Autres series
            </h2>
            <div className="flex flex-wrap gap-3">
              {allSeries
                .filter((s) => s.slug !== params.slug)
                .map((s) => (
                  <Link
                    key={s.slug}
                    href={`/series/${s.slug}`}
                    className="px-5 py-3 border-3 border-border bg-bg-secondary font-body text-sm text-text-muted transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm hover:text-accent"
                  >
                    {s.title}{" "}
                    <span className="text-accent">({s.posts.length})</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
