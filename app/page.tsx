import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);
  const totalPosts = getAllPosts().length;

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center border-b-3 border-border">
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 pattern-grid opacity-50" />

        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 w-32 h-32 border-3 border-accent opacity-20 hidden lg:block" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-accent opacity-10 hidden lg:block" />

        <div className="container-default relative py-12 sm:py-16 md:py-20">
          <div className="grid lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7">
              {/* Overline */}
              <div className="animate-fade-up">
                <span className="category-badge mb-4 sm:mb-6 md:mb-8 inline-block text-xs sm:text-sm">
                  Développement avec l&apos;IA
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-display text-4xl xs:text-5xl sm:text-6xl lg:text-7xl text-text-primary leading-[1.05] mb-4 sm:mb-6 animate-fade-up stagger-1">
                Développer avec
                <br />
                <span className="text-accent">l&apos;IA</span>
                <span className="block w-32 sm:w-40 md:w-48 h-1 bg-border mt-3 sm:mt-4" />
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-lg mb-6 sm:mb-8 md:mb-10 animate-fade-up stagger-2">
                Guides pratiques, bonnes pratiques et retours d&apos;expérience
                pour développer efficacement avec l&apos;intelligence artificielle.
              </p>

              {/* CTA */}
              <div className="flex flex-col xs:flex-row flex-wrap items-start xs:items-center gap-4 sm:gap-6 animate-fade-up stagger-3">
                <Link href="/blog" className="brutal-btn w-full xs:w-auto justify-center">
                  Explorer les articles
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="font-mono text-xs sm:text-sm text-text-muted">
                  {totalPosts} article{totalPosts > 1 ? "s" : ""} publie
                  {totalPosts > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Decorative Block */}
            <div className="lg:col-span-5 hidden lg:block animate-fade-up stagger-4">
              <div className="relative">
                {/* Main block */}
                <div className="aspect-square bg-accent border-3 border-border flex items-center justify-center">
                  <div className="text-center">
                    <span className="font-display text-8xl text-text-inverse">
                      AI
                    </span>
                    <div className="w-16 h-0.5 bg-text-inverse mx-auto mt-4" />
                  </div>
                </div>
                {/* Shadow block */}
                <div className="absolute -bottom-4 -right-4 w-full h-full border-3 border-border -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container-default">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16">
            <div>
              <span className="font-mono text-xs sm:text-sm text-accent uppercase tracking-wider mb-2 sm:mb-3 block">
                Derniers articles
              </span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary">
                Publications récentes
              </h2>
            </div>
            <Link
              href="/blog"
              className="brutal-btn-secondary self-start sm:self-auto"
            >
              Voir tout
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
          </div>

          {/* Articles Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20 border-3 border-border-light">
              <p className="font-body text-text-muted text-base sm:text-lg">
                Aucun article pour le moment...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 border-t-3 border-border">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-text-primary mb-4 sm:mb-6">
                Progressez dans
                <br />
                le dev avec l&apos;IA
              </h2>
              <p className="text-text-muted text-base sm:text-lg mb-6 sm:mb-8">
                Suivez les derniers tutoriels et bonnes pratiques pour coder
                avec l&apos;IA.
              </p>
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-secondary w-full xs:w-auto justify-center"
                >
                  <RssIcon />
                  Flux RSS
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-secondary w-full xs:w-auto justify-center"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <StatCard number={totalPosts.toString()} label="Articles" />
              <StatCard number="4" label="Categories" />
              <StatCard number="12+" label="Sujets" />
              <StatCard number="2025" label="Actif depuis" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="border-3 border-border p-4 sm:p-5 md:p-6 bg-bg-secondary hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-brutal transition-all">
      <div className="font-display text-2xl sm:text-3xl md:text-4xl text-accent mb-1 sm:mb-2">{number}</div>
      <div className="font-body text-xs sm:text-sm text-text-muted uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function RssIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
