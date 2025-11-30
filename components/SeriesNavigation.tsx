import Link from "next/link";
import { PostMeta } from "@/lib/posts";

interface SeriesNavigationProps {
  seriesTitle: string;
  posts: PostMeta[];
  currentSlug: string;
}

export default function SeriesNavigation({
  seriesTitle,
  posts,
  currentSlug,
}: SeriesNavigationProps) {
  if (posts.length <= 1) return null;

  const currentIndex = posts.findIndex((p) => p.slug === currentSlug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="my-8 p-6 rounded-lg border border-[var(--accent-dim)] bg-[var(--bg-secondary)]">
      {/* Series header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border)]">
        <div className="font-mono text-xs text-[var(--text-muted)]">
          <span className="text-[var(--accent)]">&gt;</span> Serie : {seriesTitle}
        </div>
        <div className="font-mono text-xs text-[var(--accent)]">
          {currentIndex + 1} / {posts.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--border)] rounded-full mb-4">
        <div
          className="h-full bg-[var(--accent)] rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
        />
      </div>

      {/* Posts in series */}
      <div className="space-y-2 mb-4">
        {posts.map((post, index) => (
          <div
            key={post.slug}
            className={`flex items-center gap-3 text-sm ${
              post.slug === currentSlug
                ? "text-[var(--accent)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            <span className="font-mono text-xs w-6">
              {post.slug === currentSlug ? "▶" : `${index + 1}.`}
            </span>
            {post.slug === currentSlug ? (
              <span className="font-mono text-xs truncate">{post.title}</span>
            ) : (
              <Link
                href={`/blog/${post.slug}`}
                className="font-mono text-xs truncate hover:text-[var(--accent)] transition-colors"
              >
                {post.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Precedent
          </Link>
        ) : (
          <span />
        )}
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            Suivant
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
