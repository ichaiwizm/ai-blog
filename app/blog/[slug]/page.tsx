import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPosts, getPostBySlug, getRelatedPosts, getPostsBySeries, extractHeadings } from "@/lib/posts";
import { compileMDXContent } from "@/lib/mdx";
import Comments from "@/components/Comments";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import Reactions from "@/components/Reactions";
import RelatedPosts from "@/components/RelatedPosts";
import Breadcrumbs from "@/components/Breadcrumbs";
import AuthorBio from "@/components/AuthorBio";
import SeriesNavigation from "@/components/SeriesNavigation";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Article non trouve" };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";

  return {
    title: `${post.title} - AI Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : undefined,
    },
    alternates: {
      canonical: `${baseUrl}/blog/${params.slug}`,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { content } = await compileMDXContent(post.content);
  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(params.slug, 3);
  const seriesPosts = post.series ? getPostsBySeries(post.series) : [];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";
  const articleUrl = `${baseUrl}/blog/${params.slug}`;

  return (
    <>
      <ReadingProgress />
      <TableOfContents headings={headings} />

      <main className="min-h-screen py-16 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6 animate-fade-up">
            <Breadcrumbs
              items={[
                { label: "Accueil", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>

          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-10 animate-fade-up"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Retour aux articles
          </Link>

          {/* Series navigation (if part of a series) */}
          {post.series && seriesPosts.length > 1 && (
            <div className="animate-fade-up stagger-1">
              <SeriesNavigation
                seriesTitle={post.series
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                posts={seriesPosts}
                currentSlug={params.slug}
              />
            </div>
          )}

          {/* Article header */}
          <header className="mb-12 pb-8 border-b border-[var(--border)]">
            {/* Terminal style path */}
            <div className="font-mono text-xs text-[var(--text-muted)] mb-6 animate-fade-up">
              <span className="text-[var(--accent)]">~/blog/</span>
              <span>{params.slug}</span>
              <span className="text-[var(--accent)]">.mdx</span>
            </div>

            {/* Category badge */}
            {post.category && (
              <Link
                href={`/category/${post.category}`}
                className="inline-block px-3 py-1 mb-4 rounded text-xs font-mono bg-[var(--accent-dim)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg-primary)] transition-colors animate-fade-up"
              >
                {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
              </Link>
            )}

            {/* Title */}
            <h1 className="font-mono text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-6 animate-fade-up stagger-1">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-[var(--text-muted)] mb-6 animate-fade-up stagger-2">
              <time dateTime={post.date} className="flex items-center gap-2">
                <CalendarIcon />
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <span className="flex items-center gap-2">
                <ClockIcon />
                {post.readingTime}
              </span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6 animate-fade-up stagger-3">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`} className="tag-chip">
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Share buttons */}
            <div className="animate-fade-up stagger-4">
              <ShareButtons title={post.title} url={articleUrl} />
            </div>
          </header>

          {/* Article content */}
          <div className="prose prose-lg max-w-none animate-fade-up stagger-4">
            {content}
          </div>

          {/* Reactions */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <Reactions slug={params.slug} />
          </div>

          {/* Author bio */}
          <AuthorBio />

          {/* Related posts */}
          <RelatedPosts posts={relatedPosts} />

          {/* Comments */}
          <Comments slug={params.slug} />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href="/blog"
                className="font-mono text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                &larr; Voir tous les articles
              </Link>
              <ShareButtons title={post.title} url={articleUrl} />
            </div>
            <div className="font-mono text-xs text-[var(--text-muted)] text-center mt-6">
              <span className="text-[var(--accent)]">&gt;</span> EOF
            </div>
          </footer>
        </article>
      </main>
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
