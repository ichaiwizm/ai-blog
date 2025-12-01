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
      <section className="border-b border-border-light bg-bg-secondary">
        <div className="container-default py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-accent transition-colors mb-10 animate-fade-up group"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-1 transition-transform"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour à l&apos;accueil
          </Link>

          <div className="animate-fade-up stagger-1">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-8">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
              {posts.length} article{posts.length > 1 ? "s" : ""} publié{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-8 animate-fade-up stagger-2 leading-tight">
            Tous les articles
          </h1>

          <p className="text-xl sm:text-2xl text-text-body max-w-2xl leading-relaxed animate-fade-up stagger-3">
            Explorez tous mes articles sur l&apos;intelligence artificielle, le machine learning et les
            technologies émergentes.
          </p>
        </div>
      </section>

      {/* Tags filter */}
      {tags.length > 0 && (
        <section className="border-b border-border-light py-8 bg-bg-primary">
          <div className="container-default">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-sm text-text-muted font-medium">
                Filtrer par tag :
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
      <section className="py-24 bg-bg-primary">
        <div className="container-default">
          {posts.length === 0 ? (
            <div className="text-center py-24 editorial-card">
              <p className="text-text-muted text-lg">
                Aucun article trouvé...
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
