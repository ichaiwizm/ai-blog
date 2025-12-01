import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/lib/posts";

export default function ArticleCard({
  post,
  index = 0,
}: {
  post: PostMeta;
  index?: number;
}) {
  return (
    <article
      className={`group animate-fade-up`}
      style={{ animationDelay: `${(index % 6) * 0.1}s` }}
    >
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="h-full editorial-card overflow-hidden">
          {/* Image with Overlay */}
          {post.image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-bg-tertiary">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 via-text-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Category Badge Overlay */}
              {post.category && (
                <div className="absolute top-4 left-4">
                  <span className="category-badge">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Category if no image */}
            {!post.image && post.category && (
              <span className="category-badge">
                {post.category}
              </span>
            )}

            {/* Title - Editorial Typography */}
            <h2 className="font-display text-2xl sm:text-3xl text-text-primary leading-tight transition-colors group-hover:text-accent">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
              {post.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between pt-4 border-t border-border-light">
              <div className="flex items-center gap-4 font-mono text-xs text-text-muted">
                <time dateTime={post.date} className="uppercase tracking-wider">
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <span className="w-1 h-1 bg-text-muted rounded-full" />
                <span className="flex items-center gap-1 uppercase tracking-wider">
                  <ClockIcon />
                  {post.readingTime}
                </span>
              </div>

              {/* Arrow - Animated */}
              <div className="text-accent transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                <ArrowIcon />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] text-text-muted uppercase tracking-wider px-2 py-1 border border-border-light hover:border-accent hover:text-accent transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

function ClockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
