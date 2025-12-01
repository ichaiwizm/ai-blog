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
        <div className="h-full modern-card bg-bg-secondary overflow-hidden flex flex-col">
          {/* Image */}
          {post.image && (
            <div className="relative w-full aspect-[16/10] overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          <div className="p-6 flex flex-col flex-1">
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

            {/* Spacer to push meta to bottom */}
            <div className="flex-1" />

            {/* Meta */}
            <div className="flex items-center justify-between pt-4 border-t border-border-light">
              <div className="flex items-center gap-4 font-mono text-xs text-text-muted">
                <time dateTime={post.date}>
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

              {/* Arrow */}
              <div className="text-accent opacity-0 group-hover:opacity-100 transform translate-x-[-12px] group-hover:translate-x-0 transition-all duration-300">
                <ArrowIcon />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[10px] font-mono text-text-muted bg-bg-tertiary rounded-full lowercase"
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
