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
        <div className="h-full border-3 border-border bg-bg-secondary transition-all duration-200 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal-hover">
          {/* Image */}
          {post.image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden border-b-3 border-border">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}

          <div className="p-4 sm:p-5 md:p-6">
            {/* Category */}
            {post.category && (
              <span className="category-badge mb-3 sm:mb-4 inline-block text-[10px] sm:text-xs">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h2 className="font-display text-lg sm:text-xl md:text-2xl text-text-primary mb-2 sm:mb-3 group-hover:text-accent transition-colors leading-tight">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-text-muted text-sm sm:text-base mb-4 sm:mb-5 line-clamp-2">
              {post.description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t-2 border-border-light">
              <div className="flex items-center gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs text-text-muted">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <ClockIcon />
                  {post.readingTime}
                </span>
              </div>

              {/* Arrow */}
              <div className="text-accent opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-200">
                <ArrowIcon />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9px] sm:text-[10px] text-text-muted uppercase tracking-wider"
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
