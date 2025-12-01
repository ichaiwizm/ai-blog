import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);
  const totalPosts = getAllPosts().length;

  return (
    <>
      {/* Hero Section - Magazine Editorial Style */}
      <section className="relative min-h-[90vh] flex items-center gradient-overlay overflow-hidden">
        {/* Decorative Elements - Subtle circles */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl hidden lg:block animate-float" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-accent/10 rounded-full blur-2xl hidden lg:block" style={{ animationDelay: '1s' }} />

        <div className="container-default relative py-24">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7">
              {/* Overline */}
              <div className="animate-fade-up">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-medium text-sm mb-8">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 2l2.5 7.5h7.5l-6 4.5 2.5 7.5-6-4.5-6 4.5 2.5-7.5-6-4.5h7.5z" opacity="0.5" />
                  </svg>
                  Blog sur l&apos;Intelligence Artificielle
                </span>
              </div>

              {/* Main Title - Large and expressive */}
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-text-primary leading-[1.05] mb-8 animate-fade-up stagger-1">
                Exploration de
                <br />
                l&apos;<span className="text-accent italic">Intelligence</span>
                <br />
                <span className="text-accent">Artificielle</span>
              </h1>

              {/* Subtitle - Generous spacing */}
              <p className="text-xl sm:text-2xl text-text-body max-w-xl mb-12 leading-relaxed animate-fade-up stagger-2">
                Découvrez des analyses approfondies sur les modèles de langage,
                l&apos;apprentissage automatique et l&apos;avenir de la technologie.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap items-center gap-6 animate-fade-up stagger-3">
                <Link href="/blog" className="btn-primary">
                  Explorer les articles
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <span className="text-sm text-text-muted flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  {totalPosts} article{totalPosts > 1 ? "s" : ""} publié{totalPosts > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Visual Element - Modern and clean */}
            <div className="lg:col-span-5 hidden lg:block animate-fade-up stagger-4">
              <div className="relative">
                {/* Main card */}
                <div className="aspect-square bg-gradient-to-br from-accent to-accent-hover rounded-3xl p-12 flex items-center justify-center shadow-glow relative overflow-hidden">
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                      backgroundSize: '32px 32px'
                    }} />
                  </div>

                  <div className="text-center relative z-10">
                    <span className="font-display text-8xl xl:text-9xl text-text-inverse font-bold">
                      AI
                    </span>
                    <div className="w-24 h-1 bg-text-inverse/50 mx-auto mt-6 rounded-full" />
                    <p className="text-text-inverse/80 mt-4 text-sm font-medium">Since 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-32 bg-bg-secondary">
        <div className="container-default">
          {/* Section Header - Editorial style */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-20">
            <div className="max-w-2xl">
              <span className="text-sm text-accent uppercase tracking-wider font-semibold mb-4 block">
                Derniers articles
              </span>
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-4">
                Publications récentes
              </h2>
              <p className="text-text-muted text-lg leading-relaxed">
                Explorez mes dernières réflexions sur l&apos;IA, les LLMs et les technologies émergentes.
              </p>
            </div>
            <Link
              href="/blog"
              className="btn-secondary self-start sm:self-auto flex-shrink-0"
            >
              Voir tout
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Articles Grid */}
          {posts.length === 0 ? (
            <div className="text-center py-24 editorial-card">
              <p className="text-text-muted text-lg">
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

      {/* CTA Section - Elegant and inviting */}
      <section className="py-32 border-t border-border-light">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl sm:text-5xl text-text-primary mb-6 leading-tight">
                Restez informé sur
                <br />
                les avancées de l&apos;IA
              </h2>
              <p className="text-text-muted text-lg mb-10 leading-relaxed">
                Suivez les dernières publications et analyses sur
                l&apos;intelligence artificielle, les modèles de langage
                et l&apos;avenir de la technologie.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <RssIcon />
                  Flux RSS
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>

            {/* Stats - Refined cards */}
            <div className="grid grid-cols-2 gap-6">
              <StatCard number={totalPosts.toString()} label="Articles" />
              <StatCard number="4" label="Catégories" />
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
    <div className="editorial-card p-8 text-center group cursor-default">
      <div className="font-display text-5xl text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="text-sm text-text-muted font-medium tracking-wide">
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
      strokeLinecap="round"
      strokeLinejoin="round"
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
