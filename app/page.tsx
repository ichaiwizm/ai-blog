import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const allPosts = await getAllPosts();
  const posts = allPosts.slice(0, 6);
  const totalPosts = allPosts.length;

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

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-text-primary leading-[1.05] mb-6 md:mb-8 animate-fade-up stagger-1">
                L&apos;IA par
                <br />
                <span className="text-accent">Wizycode</span>
              </h1>

              <p className="font-body text-base sm:text-lg md:text-xl text-text-muted max-w-lg mb-8 md:mb-10 animate-fade-up stagger-2 leading-relaxed">
                Guides, actualités et analyses sur l&apos;intelligence artificielle et le développement web moderne.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up stagger-3">
                <Link href="/blog" className="brutal-btn-primary text-center sm:text-left">
                  Lire les articles →
                </Link>
                <Link href="/concepts" className="brutal-btn-secondary text-center sm:text-left">
                  Explorer les concepts
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-5 animate-fade-up stagger-4">
              <div className="border-3 border-border bg-bg-secondary p-6 sm:p-8">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  <div className="border-3 border-border p-4 text-center bg-bg-primary">
                    <div className="font-display text-3xl sm:text-4xl text-accent mb-1">{totalPosts}</div>
                    <div className="font-mono text-xs text-text-muted uppercase tracking-wider">Articles</div>
                  </div>
                  <div className="border-3 border-border p-4 text-center bg-bg-primary">
                    <div className="font-display text-3xl sm:text-4xl text-accent mb-1">100%</div>
                    <div className="font-mono text-xs text-text-muted uppercase tracking-wider">Français</div>
                  </div>
                  <div className="border-3 border-border p-4 text-center bg-bg-primary col-span-2">
                    <div className="font-mono text-xs text-text-muted uppercase tracking-wider mb-2">Mis à jour</div>
                    <div className="font-display text-sm text-text-primary">
                      {new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {posts.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container-default">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="font-mono text-xs text-accent uppercase tracking-wider mb-2 block">
                  — Derniers articles
                </span>
                <h2 className="font-display text-3xl sm:text-4xl text-text-primary">
                  Récemment publié
                </h2>
              </div>
              <Link href="/blog" className="brutal-btn-secondary hidden sm:flex">
                Tout voir →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} index={index} />
              ))}
            </div>

            <div className="mt-12 text-center sm:hidden">
              <Link href="/blog" className="brutal-btn-secondary">
                Voir tous les articles →
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
