import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export default function Home() {
  const posts = getAllPosts().slice(0, 6);
  const totalPosts = getAllPosts().length;

  return (
    <>
      {/* Hero Section - Editorial Asymmetric */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden texture-paper">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 pattern-grid opacity-40" />

        {/* Large Editorial Number */}
        <div className="editorial-number" style={{ top: '-5%', right: '5%' }}>
          01
        </div>

        <div className="container-wide relative py-24">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Text Content - Asymmetric */}
            <div className="lg:col-span-7 space-y-8">
              {/* Overline with accent line */}
              <div className="animate-fade-up flex items-center gap-4">
                <div className="w-16 h-0.5 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted font-bold">
                  Journal Technique
                </span>
              </div>

              {/* Main Title - Massive Editorial Typography */}
              <h1 className="animate-fade-up stagger-1">
                Intelligence
                <br />
                <span className="relative inline-block">
                  <span className="text-accent">Artificielle</span>
                  <svg
                    className="absolute -bottom-4 left-0 w-full"
                    height="6"
                    viewBox="0 0 200 6"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 3 L200 3"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-accent"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle - Editorial */}
              <p className="text-lg text-text-body max-w-xl leading-relaxed animate-fade-up stagger-2">
                Explorations techniques et réflexions critiques sur les modèles de
                langage, l&apos;apprentissage automatique et l&apos;évolution des
                systèmes intelligents.
              </p>

              {/* CTA with Stats */}
              <div className="flex flex-wrap items-center gap-8 animate-fade-up stagger-3">
                <Link href="/blog" className="brutal-btn group">
                  Explorer les articles
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

                <div className="flex items-center gap-3 font-mono text-sm">
                  <div className="w-12 h-12 bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <span className="font-bold text-accent text-lg">
                      {totalPosts}
                    </span>
                  </div>
                  <div className="text-text-muted uppercase tracking-wider text-xs">
                    Articles<br />publiés
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Element - Angular Design */}
            <div className="lg:col-span-5 hidden lg:block animate-fade-up stagger-4">
              <div className="relative">
                {/* Main Angular Block */}
                <div
                  className="relative h-[400px] bg-gradient-to-br from-accent to-support-orange overflow-hidden"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)' }}
                >
                  {/* Overlay Pattern */}
                  <div className="absolute inset-0 pattern-mesh opacity-20" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center text-center p-8">
                    <div>
                      <div className="font-display text-8xl font-bold text-text-inverse mb-4">
                        AI
                      </div>
                      <div className="h-1 w-20 bg-text-inverse mx-auto" />
                      <div className="mt-6 font-mono text-xs text-text-inverse/80 uppercase tracking-widest">
                        Intelligence × Critique
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accent Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-accent opacity-40" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-text-primary/5 -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Diagonal Divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-2 bg-accent"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 2% 100%)' }}
        />
      </section>

      {/* Recent Articles Section - Editorial Grid */}
      <section className="py-32 bg-bg-secondary">
        <div className="container-wide">
          {/* Section Header - Editorial Style */}
          <div className="mb-20">
            <div className="flex items-start justify-between gap-8 flex-wrap">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">
                    02
                  </span>
                  <div className="h-px flex-1 bg-border-light max-w-[100px]" />
                </div>
                <h2 className="font-display text-5xl text-text-primary leading-tight">
                  Publications<br />récentes
                </h2>
              </div>

              <Link
                href="/blog"
                className="brutal-btn-secondary self-end"
              >
                Tout voir
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
          </div>

          {/* Articles Grid - Magazine Layout */}
          {posts.length === 0 ? (
            <div className="text-center py-32 border border-border-light bg-bg-primary">
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

      {/* CTA Section - Angular Design */}
      <section className="relative py-32 bg-bg-primary overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pattern-grid opacity-30" />
        <div className="editorial-number" style={{ bottom: '-10%', left: '10%' }}>
          03
        </div>

        <div className="container-wide relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-0.5 bg-accent" />
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">
                  Restez informé
                </span>
              </div>

              <h2 className="font-display text-5xl text-text-primary leading-tight">
                Suivez les avancées<br />
                de l&apos;IA
              </h2>

              <p className="text-text-body text-lg leading-relaxed max-w-lg">
                Analyses approfondies, perspectives techniques et discussions
                critiques sur l&apos;intelligence artificielle et ses implications.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="/feed.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-secondary"
                >
                  <RssIcon />
                  Flux RSS
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn-secondary"
                >
                  <GithubIcon />
                  GitHub
                </a>
              </div>
            </div>

            {/* Stats Grid - Editorial */}
            <div className="grid grid-cols-2 gap-6">
              <StatCard number={totalPosts.toString().padStart(2, '0')} label="Articles" />
              <StatCard number="04" label="Catégories" />
              <StatCard number="12+" label="Sujets" />
              <StatCard number="2025" label="Actif depuis" accent />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function StatCard({
  number,
  label,
  accent = false
}: {
  number: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="group relative editorial-card p-8 bg-bg-secondary hover:bg-bg-tertiary transition-colors">
      <div className={`font-display text-5xl mb-3 font-bold transition-colors ${
        accent ? 'text-accent' : 'text-text-primary group-hover:text-accent'
      }`}>
        {number}
      </div>
      <div className="font-mono text-xs text-text-muted uppercase tracking-[0.15em]">
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
