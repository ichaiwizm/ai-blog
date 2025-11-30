import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 5);

  return (
    <main className="grid-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Glowing orb background effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)] rounded-full blur-[200px] opacity-5 pointer-events-none" />

          <div className="relative">
            {/* Terminal header */}
            <div className="font-mono text-xs text-[var(--text-muted)] mb-6 animate-fade-up">
              <span className="text-[var(--accent)]">&gt;</span> Welcome to
            </div>

            {/* Main title */}
            <h1 className="font-mono text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up stagger-1">
              <span className="text-[var(--text-primary)]">AI</span>
              <span className="text-[var(--accent)] glow">_</span>
              <span className="text-[var(--text-primary)]">Blog</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-[var(--text-secondary)] max-w-xl mb-8 animate-fade-up stagger-2">
              Explorations et reflexions sur l&apos;intelligence artificielle,
              les modeles de langage et l&apos;avenir de la technologie.
            </p>

            {/* CTA */}
            <div className="flex items-center gap-4 animate-fade-up stagger-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-mono text-sm font-bold rounded hover:brightness-110 transition-all"
              >
                Explorer les articles
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <span className="font-mono text-xs text-[var(--text-muted)]">
                {posts.length} article{posts.length > 1 ? "s" : ""} publie{posts.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="py-16 px-6 border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-mono text-2xl font-bold text-[var(--text-primary)] cursor-blink">
                Articles recents
              </h2>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
                <span className="text-[var(--accent)]">$</span> ls -la ./posts
              </p>
            </div>
            <Link
              href="/blog"
              className="font-mono text-xs text-[var(--accent)] hover:underline underline-offset-4"
            >
              Voir tout &rarr;
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-[var(--text-muted)]">
                <span className="text-[var(--accent)]">&gt;</span> Aucun article pour le moment...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter section (placeholder) */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border rounded-lg p-8 bg-[var(--bg-secondary)]">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="font-mono text-lg font-bold text-[var(--text-primary)] mb-2">
                  Restez connecte
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Suivez les dernieres publications sur l&apos;IA directement dans votre feed.
                </p>
              </div>
              <a
                href="https://github.com/ichaiwizm/ai-blog"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--border)] rounded font-mono text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                <GithubIcon />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
