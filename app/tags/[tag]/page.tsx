import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

interface Props {
  params: { tag: string };
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: Props) {
  return {
    title: `#${params.tag} - AI Blog`,
    description: `Tous les articles avec le tag ${params.tag}`,
  };
}

export default function TagPage({ params }: Props) {
  const posts = getPostsByTag(params.tag);
  const allTags = getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="grid-bg min-h-screen py-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 animate-fade-up">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les articles
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-mono text-4xl font-bold mb-4">
            <span className="text-[var(--accent)]">#</span>
            <span className="text-[var(--text-primary)]">{params.tag}</span>
          </h1>

          <p className="text-[var(--text-secondary)]">
            Tous les articles avec ce tag.
          </p>
        </header>

        {/* Other tags */}
        <div className="mb-10 animate-fade-up stagger-1">
          <div className="font-mono text-xs text-[var(--text-muted)] mb-3">
            Autres tags :
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags
              .filter((t) => t.toLowerCase() !== params.tag.toLowerCase())
              .map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="tag-chip">
                  #{tag}
                </Link>
              ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <ArticleCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
