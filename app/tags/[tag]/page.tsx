import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  return {
    title: `#${tag} - AI Blog`,
    description: `Tous les articles avec le tag ${tag}`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  const allTags = await getAllTags();

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      {/* Header */}
      <section className="border-b-3 border-border bg-bg-secondary">
        <div className="container-default py-16">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors mb-8 animate-fade-up"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Tous les articles
          </Link>

          <div className="animate-fade-up stagger-1">
            <span className="category-badge mb-6 inline-block">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl mb-6 animate-fade-up stagger-2">
            <span className="text-accent">#</span>
            <span className="text-text-primary">{tag}</span>
          </h1>

          <p className="text-xl text-text-muted animate-fade-up stagger-3">
            Tous les articles avec ce tag.
          </p>
        </div>
      </section>

      {/* Other tags */}
      <section className="border-b-3 border-border-light py-6">
        <div className="container-default">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Autres tags
            </span>
            <div className="flex flex-wrap gap-2">
              {allTags
                .filter((t) => t.toLowerCase() !== tag.toLowerCase())
                .map((t) => (
                  <Link key={t} href={`/tags/${t.toLowerCase()}`} className="tag-chip">
                    #{t}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16">
        <div className="container-default">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <ArticleCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
