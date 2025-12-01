import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  getPostsBySeries,
  extractHeadings,
} from "@/lib/posts";
import { getConceptsBySlugs } from "@/lib/concepts";
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
import Prerequisites from "@/components/Prerequisites";
import ArticleTracker from "@/components/ArticleTracker";
import ArticleActions from "@/components/ArticleActions";

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

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";

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
  const prerequisiteConcepts = post.prerequisites
    ? getConceptsBySlugs(post.prerequisites)
    : [];
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";
  const articleUrl = `${baseUrl}/blog/${params.slug}`;

  return (
    <ArticleTracker slug={params.slug}>
      <ReadingProgress />
      <TableOfContents headings={headings} />

      <article className="min-h-screen">
        {/* Article Header */}
        <header className="border-b-3 border-border bg-bg-secondary">
          <div className="container-narrow py-16">
            {/* Breadcrumbs */}
            <div className="mb-8 animate-fade-up">
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
              className="inline-flex items-center gap-2 font-body text-sm font-medium text-text-muted hover:text-accent transition-colors mb-8 animate-fade-up"
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
              Retour aux articles
            </Link>

            {/* Category */}
            {post.category && (
              <div className="animate-fade-up stagger-1">
                <Link
                  href={`/category/${post.category}`}
                  className="category-badge mb-6 inline-block"
                >
                  {post.category}
                </Link>
              </div>
            )}

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-text-primary leading-[1.1] mb-8 animate-fade-up stagger-2">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-sm text-text-muted mb-8 animate-fade-up stagger-3">
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
              <div className="flex flex-wrap gap-2 mb-8 animate-fade-up stagger-4">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag.toLowerCase()}`}
                    className="tag-chip"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Actions (Favorite + Share) */}
            <div className="animate-fade-up stagger-5">
              <ArticleActions slug={params.slug} title={post.title} url={articleUrl} />
            </div>
          </div>
        </header>

        {/* Hero Image */}
        {post.image && (
          <div className="border-b-3 border-border">
            <div className="container-default py-0">
              <div className="relative aspect-[21/9] w-full overflow-hidden border-x-3 border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        )}

        {/* Series Navigation */}
        {post.series && seriesPosts.length > 1 && (
          <div className="border-b-3 border-border bg-bg-tertiary">
            <div className="container-narrow py-8">
              <SeriesNavigation
                seriesTitle={post.series
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
                posts={seriesPosts}
                currentSlug={params.slug}
              />
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="container-narrow py-16">
          {/* Prerequisites */}
          {prerequisiteConcepts.length > 0 && (
            <Prerequisites concepts={prerequisiteConcepts} />
          )}

          <div className="prose prose-lg max-w-none">{content}</div>

          {/* Reactions */}
          <div className="mt-16 pt-8 border-t-2 border-border">
            <Reactions slug={params.slug} />
          </div>

          {/* Author */}
          <AuthorBio />

          {/* Related Posts */}
          <RelatedPosts posts={relatedPosts} />

          {/* Comments */}
          <Comments slug={params.slug} />

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t-2 border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <Link
                href="/blog"
                className="brutal-btn-secondary"
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
                Tous les articles
              </Link>
              <ShareButtons title={post.title} url={articleUrl} />
            </div>
          </footer>
        </div>
      </article>
    </ArticleTracker>
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
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
