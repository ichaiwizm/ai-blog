import { getAllPosts, getAllTags } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const metadata = {
  title: "Tous les articles - AI Blog",
  description:
    "Liste de tous les articles du blog sur l'intelligence artificielle",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      {/* Header */}
      <section className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors mb-8 animate-fade-up"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>

          <div className="animate-fade-up stagger-1">
            <span className="category-badge mb-6 inline-block">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-text-primary mb-6 animate-fade-up stagger-2">
            Tous les articles
          </h1>

          <p className="text-xl text-text-muted max-w-xl animate-fade-up stagger-3">
            Explorez tous les articles sur l&apos;IA, le machine learning et les
            technologies emergentes.
          </p>
        </div>
      </section>

      {/* Tags filter */}
      {tags.length > 0 && (
        <section className="border-b-3 border-border-light py-6">
          <div className="container-default">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
                Filtrer par tag
              </span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="tag-chip"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16">
        <div className="container-default">
          {posts.length === 0 ? (
            <div className="text-center py-20 border-3 border-border-light">
              <p className="font-body text-text-muted text-lg">
                Aucun article trouve...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
