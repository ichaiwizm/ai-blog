import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-32 relative overflow-hidden">
      {/* Angular Accent Top */}
      <div
        className="h-1 bg-gradient-to-r from-accent via-support-orange to-accent"
        style={{ clipPath: 'polygon(0 0, 100% 0, 99% 100%, 0 100%)' }}
      />

      {/* Main Footer Content */}
      <div className="bg-bg-secondary">
        <div className="container-wide py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 bg-accent flex items-center justify-center"
                  style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 75% 100%, 0 100%)' }}
                >
                  <span className="font-display text-lg font-bold text-text-inverse">
                    AI
                  </span>
                </div>
                <div>
                  <div className="font-display text-2xl text-text-primary">
                    Journal
                  </div>
                  <div className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
                    Technique
                  </div>
                </div>
              </div>

              <p className="text-text-body leading-relaxed max-w-md">
                Intelligence artificielle décryptée. Analyses approfondies,
                perspectives techniques et réflexions critiques sur l&apos;avenir
                de la technologie.
              </p>

              {/* Newsletter */}
              <div className="max-w-md">
                <div className="mb-3 flex items-center gap-3">
                  <div className="w-12 h-px bg-accent" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-bold">
                    Newsletter
                  </h3>
                </div>
                <NewsletterForm />
              </div>
            </div>

            {/* Navigation Columns */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              {/* Navigation */}
              <div>
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-6">
                  Navigation
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/">Accueil</FooterLink>
                  <FooterLink href="/blog">Articles</FooterLink>
                  <FooterLink href="/series">Séries</FooterLink>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-6">
                  Catégories
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/category/tutoriels">Tutoriels</FooterLink>
                  <FooterLink href="/category/actualites">Actualités</FooterLink>
                  <FooterLink href="/category/opinions">Opinions</FooterLink>
                  <FooterLink href="/category/comparatifs">Comparatifs</FooterLink>
                </ul>
              </div>

              {/* Resources & Social */}
              <div>
                <h3 className="font-mono text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-6">
                  Ressources
                </h3>
                <ul className="space-y-3">
                  <FooterLink href="/feed.xml">Flux RSS</FooterLink>
                  <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
                  <li className="pt-4">
                    <div className="font-mono text-xs font-bold text-text-primary uppercase tracking-[0.15em] mb-3">
                      Suivre
                    </div>
                  </li>
                  <FooterLink href="https://github.com" external>
                    GitHub
                  </FooterLink>
                  <FooterLink href="https://twitter.com" external>
                    Twitter
                  </FooterLink>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Editorial */}
      <div className="bg-text-primary text-text-inverse">
        <div className="container-wide py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="font-mono text-xs uppercase tracking-wider opacity-80">
                &copy; {new Date().getFullYear()} AI Journal
              </p>
              <span className="hidden sm:block w-1 h-1 bg-text-inverse/40 rounded-full" />
              <p className="font-mono text-xs uppercase tracking-wider opacity-60">
                Tous droits réservés
              </p>
            </div>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-wider opacity-60 hover:opacity-100 transition-opacity"
            >
              Déployé sur Vercel ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-sm text-text-muted hover:text-accent transition-colors inline-flex items-center gap-2 group"
        >
          <span>{children}</span>
          <svg
            className="w-3 h-3 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="font-body text-sm text-text-muted hover:text-accent transition-colors inline-block relative group"
      >
        {children}
        <span className="absolute bottom-0 left-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-300" />
      </Link>
    </li>
  );
}
