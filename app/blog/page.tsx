import { getAllPosts, getAllTags } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const metadata = {
  title: "Tous les articles - AI Blog",
  description: "Liste de tous les articles du blog sur l'intelligence artificielle",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main className="grid-bg min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-mono text-4xl font-bold text-[var(--text-primary)] mb-4">
            Tous les articles
          </h1>

          <p className="text-[var(--text-secondary)]">
            Explorez tous les articles sur l&apos;IA, le machine learning et les technologies emergentes.
          </p>
        </header>

        {/* Tags filter */}
        {tags.length > 0 && (
          <div className="mb-10 animate-fade-up stagger-1">
            <div className="font-mono text-xs text-[var(--text-muted)] mb-3">
              <span className="text-[var(--accent)]">$</span> filter --tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="tag-chip">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Posts list */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="font-mono text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">&gt;</span> Aucun article trouve...
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, index) => (
              <ArticleCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
