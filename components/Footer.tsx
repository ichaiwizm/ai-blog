import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-bg-secondary relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 gradient-mesh opacity-20" />

      {/* Main Footer Content */}
      <div className="container-default py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover rounded-xl flex items-center justify-center shadow-glow">
                <span className="font-display text-sm font-bold text-text-inverse">
                  AI
                </span>
              </div>
              <span className="font-display text-2xl font-semibold text-text-primary">
                Blog
              </span>
            </div>
            <p className="text-text-muted text-base leading-relaxed mb-8 max-w-sm">
              Intelligence artificielle décryptée. Analyses, tutoriels et réflexions sur l&apos;avenir de la technologie.
            </p>
            {/* Newsletter */}
            <div className="max-w-sm">
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {/* Navigation */}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary uppercase tracking-wider mb-5">
                Navigation
              </h3>
              <ul className="space-y-3">
                <FooterLink href="/">Accueil</FooterLink>
                <FooterLink href="/blog">Articles</FooterLink>
                <FooterLink href="/series">Series</FooterLink>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary uppercase tracking-wider mb-5">
                Categories
              </h3>
              <ul className="space-y-3">
                <FooterLink href="/category/tutoriels">Tutoriels</FooterLink>
                <FooterLink href="/category/actualites">Actualites</FooterLink>
                <FooterLink href="/category/opinions">Opinions</FooterLink>
                <FooterLink href="/category/comparatifs">Comparatifs</FooterLink>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary uppercase tracking-wider mb-5">
                Ressources
              </h3>
              <ul className="space-y-3">
                <FooterLink href="/feed.xml">Flux RSS</FooterLink>
                <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="font-body text-sm font-semibold text-text-primary uppercase tracking-wider mb-5">
                Suivre
              </h3>
              <ul className="space-y-3">
                <FooterLink href="https://github.com" external>
                  GitHub
                </FooterLink>
                <FooterLink href="https://twitter.com" external>
                  Twitter
                </FooterLink>
                <FooterLink href="https://linkedin.com" external>
                  LinkedIn
                </FooterLink>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-light relative z-10">
        <div className="container-default py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-mono text-sm text-text-muted">
              &copy; {new Date().getFullYear()} AI Blog. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-text-muted hover:text-accent transition-colors duration-300"
              >
                Déployé sur Vercel
              </a>
            </div>
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
          className="font-body text-sm text-text-muted hover:text-accent transition-colors inline-flex items-center gap-1"
        >
          {children}
          <svg
            className="w-3 h-3"
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
        className="font-body text-sm text-text-muted hover:text-accent transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
