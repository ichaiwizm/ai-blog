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
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <div className="border-3 border-border bg-bg-secondary p-6">
      {/* Series header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent border-2 border-border flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-text-inverse">
              S
            </span>
          </div>
          <span className="font-body text-sm font-semibold text-text-primary">
            {seriesTitle}
          </span>
        </div>
        <div className="font-mono text-sm text-accent font-medium">
          {currentIndex + 1}/{posts.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-border-light mb-6">
        <div
          className="h-full bg-accent transition-all"
          style={{ width: `${((currentIndex + 1) / posts.length) * 100}%` }}
        />
      </div>

      {/* Posts in series */}
      <div className="space-y-2 mb-6">
        {posts.map((post, index) => (
          <div
            key={post.slug}
            className={`flex items-center gap-3 py-2 ${
              post.slug === currentSlug ? "text-accent" : "text-text-muted"
            }`}
          >
            <span
              className={`font-mono text-xs w-6 h-6 flex items-center justify-center border-2 ${
                post.slug === currentSlug
                  ? "border-accent bg-accent-light"
                  : "border-border-light"
              }`}
            >
              {index + 1}
            </span>
            {post.slug === currentSlug ? (
              <span className="font-body text-sm font-medium truncate">
                {post.title}
              </span>
            ) : (
              <Link
                href={`/blog/${post.slug}`}
                className="font-body text-sm truncate hover:text-accent transition-colors"
              >
                {post.title}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-5 border-t-2 border-border-light">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors"
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
            Precedent
          </Link>
        ) : (
          <span />
        )}
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors"
          >
            Suivant
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
