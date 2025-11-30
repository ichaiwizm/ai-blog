import Link from "next/link";
import { PostMeta } from "@/lib/posts";

interface RelatedPostsProps {
  posts: PostMeta[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[var(--border)]">
      <h2 className="font-mono text-lg font-bold text-[var(--text-primary)] mb-6">
        <span className="text-[var(--accent)]">&gt;</span> Articles similaires
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-4 rounded border border-[var(--border)] hover:border-[var(--accent)] transition-colors bg-[var(--bg-secondary)]"
          >
            <h3 className="font-mono text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 mb-2">
              {post.title}
            </h3>
            <p className="font-serif text-xs text-[var(--text-muted)] line-clamp-2 mb-3">
              {post.description}
            </p>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </time>
              <span>·</span>
              <span>{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
