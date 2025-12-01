import Link from "next/link";
import { PostMeta } from "@/lib/posts";

interface RelatedPostsProps {
  posts: PostMeta[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t-2 border-border">
      <h2 className="font-display text-2xl text-text-primary mb-8">
        Articles similaires
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block border-3 border-border bg-bg-secondary p-5 transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal"
          >
            {post.category && (
              <span className="inline-block font-mono text-[10px] text-accent uppercase tracking-wider mb-3">
                {post.category}
              </span>
            )}
            <h3 className="font-display text-lg text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-3">
              {post.title}
            </h3>
            <p className="text-sm text-text-muted line-clamp-2 mb-4">
              {post.description}
            </p>
            <div className="flex items-center gap-3 font-mono text-xs text-text-muted">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </time>
              <span className="w-1 h-1 bg-border-light rounded-full" />
              <span>{post.readingTime}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
