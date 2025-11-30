import Link from "next/link";
import Image from "next/image";
import { PostMeta } from "@/lib/posts";

export default function ArticleCard({ post, index = 0 }: { post: PostMeta; index?: number }) {
  return (
    <article
      className={`group relative animate-fade-up stagger-${Math.min(index + 1, 4)}`}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]/50 hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)] transition-all duration-300 overflow-hidden">
          {/* Image */}
          {post.image && (
            <div className="relative w-full h-48 overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent opacity-60" />
            </div>
          )}

          <div className="p-6">
            {/* Terminal prompt style */}
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-[var(--text-muted)]">
              <span className="text-[var(--accent)]">$</span>
              <span>cat</span>
              <span className="text-[var(--text-secondary)]">{post.slug}.mdx</span>
            </div>

            {/* Title */}
            <h2 className="font-mono text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {post.title}
            </h2>

            {/* Description */}
            <p className="text-[var(--text-secondary)] mb-4 line-clamp-2">
              {post.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 font-mono text-xs text-[var(--text-muted)]">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
                <span className="flex items-center gap-1">
                  <ClockIcon />
                  {post.readingTime}
                </span>
              </div>

              {/* Arrow */}
              <div className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transform translate-x-[-8px] group-hover:translate-x-0 transition-all duration-300">
                <ArrowIcon />
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-chip">
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
