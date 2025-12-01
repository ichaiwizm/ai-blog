import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);
  const totalPosts = getAllPosts().length;

  return (
    <>
      {/* Hero Section with Organic Background */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden blob-bg">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh opacity-40" />

        {/* Floating Decorative Circles */}
        <div className="circle-decoration absolute top-20 right-20 w-96 h-96 animate-float hidden lg:block" />
        <div className="circle-decoration absolute bottom-20 left-20 w-80 h-80 animate-float" style={{ animationDelay: '2s' }} />

        <div className="container-default relative py-20">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 z-10">
              {/* Overline Badge */}
              <div className="animate-fade-up">
                <span className="category-badge mb-8 inline-block">
                  Blog sur l&apos;IA
                </span>
              </div>

              {/* Main Title - Large & Elegant */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-text-primary leading-[1.05] mb-6 animate-fade-up stagger-1">
                Intelligence
                <br />
                <span className="bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent">
                  Artificielle
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-text-muted max-w-2xl mb-12 leading-relaxed animate-fade-up stagger-2">
                Explorations et réflexions sur les modèles de langage, l&apos;apprentissage automatique et l&apos;avenir de la technologie.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-6 animate-fade-up stagger-3">
                <Link href="/blog" className="modern-btn group">
                  Explorer les articles
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="font-mono text-sm text-text-muted px-4 py-2 bg-bg-tertiary rounded-full">
                  {totalPosts} article{totalPosts > 1 ? "s" : ""} publié{totalPosts > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Decorative Block - Organic Shape */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center animate-scale-up stagger-4">
              <div className="relative">
                {/* Main circular element with gradient */}
                <div className="w-80 h-80 rounded-[40%] bg-gradient-to-br from-accent via-accent-hover to-accent-secondary flex items-center justify-center shadow-large animate-float glow-soft">
                  <div className="text-center">
                    <span className="font-display text-9xl font-bold text-text-inverse drop-shadow-lg">
                      AI
                    </span>
                  </div>
                </div>
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-[40%] border-4 border-accent/30 animate-pulse" style={{ transform: 'scale(1.1)' }} />
                <div className="absolute inset-0 rounded-[40%] border-2 border-accent/20 animate-pulse" style={{ transform: 'scale(1.2)', animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-32 relative">
        <div className="container-default">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <span className="font-mono text-sm text-accent uppercase tracking-wider mb-4 block">
                Derniers articles
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary">
                Publications récentes
              </h2>
              <p className="text-text-muted mt-4 text-lg">
                Découvrez nos dernières analyses et réflexions sur l&apos;IA
              </p>
            </div>
            <Link
              href="/blog"
              className="modern-btn-secondary group self-start sm:self-auto"
            >
              Voir tout
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="transition-transform group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Articles Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-bg-tertiary rounded-3xl border border-border">
              <p className="font-body text-text-muted text-lg">
                Aucun article pour le moment...
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section with Gradient Background */}
      <section className="py-24 relative overflow-hidden">
        {/* Organic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-light via-bg-primary to-accent-secondary-light opacity-60" />
        <div className="circle-decoration absolute top-0 right-0 w-96 h-96" />
        <div className="circle-decoration absolute bottom-0 left-0 w-80 h-80" />

        <div className="container-default relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6 leading-tight">
                Restez informé sur les avancées de l&apos;IA
              </h2>
              <p className="text-text-muted text-lg sm:text-xl mb-10 leading-relaxed max-w-xl">
                Suivez les dernières publications et analyses sur l&apos;intelligence artificielle.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-btn-secondary"
                >
                  <RssIcon />
                  Flux RSS
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modern-btn-secondary"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <StatCard number={totalPosts.toString()} label="Articles" index={0} />
              <StatCard number="4" label="Catégories" index={1} />
              <StatCard number="12+" label="Sujets" index={2} />
              <StatCard number="2025" label="Actif depuis" index={3} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({ number, label, index }: { number: string; label: string; index: number }) {
  return (
    <div
      className={`modern-card p-8 backdrop-blur-sm bg-bg-secondary/80 animate-fade-up stagger-${index + 1}`}
    >
      <div className="font-display text-5xl font-semibold bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent mb-3">
        {number}
      </div>
      <div className="font-body text-sm text-text-muted uppercase tracking-wide font-medium">
        {label}
      </div>
    </div>
  );
}

function RssIcon() {
  return (
    <svg
      width="20"
      height="20"
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
