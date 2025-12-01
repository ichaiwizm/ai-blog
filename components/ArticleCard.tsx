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
        <div className="h-full editorial-card">
          {/* Image */}
          {post.image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Category */}
            {post.category && (
              <span className="category-badge mb-4 inline-block">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h2 className="font-display text-xl sm:text-2xl text-text-primary mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-text-muted text-base mb-5 line-clamp-2 leading-relaxed">
              {post.description}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border-light">
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <time
                  dateTime={post.date}
                  className="flex items-center gap-1.5"
                >
                  <CalendarIcon />
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-1.5">
                  <ClockIcon />
                  {post.readingTime}
                </span>
              </div>

              {/* Arrow - elegant reveal */}
              <div className="text-accent opacity-0 group-hover:opacity-100 transform translate-x-[-6px] group-hover:translate-x-0 transition-all duration-400">
                <ArrowIcon />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="tag-chip text-xs"
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

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
