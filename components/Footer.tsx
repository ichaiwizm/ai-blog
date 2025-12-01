import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-border-light bg-bg-secondary">
      {/* Main Footer Content */}
      <div className="container-default py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-accent to-accent-hover rounded-2xl flex items-center justify-center shadow-soft">
                <span className="font-display text-lg font-bold text-text-inverse">
                  AI
                </span>
              </div>
              <span className="font-display text-2xl font-semibold text-text-primary tracking-tight">
                Blog
              </span>
            </div>
            <p className="text-text-muted text-base leading-relaxed mb-10 max-w-sm">
              Intelligence artificielle décryptée. Analyses, tutoriels et
              réflexions sur l&apos;avenir de la technologie.
            </p>
            {/* Newsletter */}
            <div className="max-w-sm">
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                Restez informé
              </h4>
              <NewsletterForm />
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-10">
            {/* Navigation */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-6">
                Navigation
              </h3>
              <ul className="space-y-4">
                <FooterLink href="/">Accueil</FooterLink>
                <FooterLink href="/blog">Articles</FooterLink>
                <FooterLink href="/series">Séries</FooterLink>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-6">
                Catégories
              </h3>
              <ul className="space-y-4">
                <FooterLink href="/category/tutoriels">Tutoriels</FooterLink>
                <FooterLink href="/category/actualites">Actualités</FooterLink>
                <FooterLink href="/category/opinions">Opinions</FooterLink>
                <FooterLink href="/category/comparatifs">Comparatifs</FooterLink>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-6">
                Ressources
              </h3>
              <ul className="space-y-4">
                <FooterLink href="/feed.xml">Flux RSS</FooterLink>
                <FooterLink href="/sitemap.xml">Sitemap</FooterLink>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-6">
                Suivre
              </h3>
              <ul className="space-y-4">
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
      <div className="border-t border-border-light">
        <div className="container-default py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-text-muted">
              &copy; {new Date().getFullYear()} AI Blog. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-muted hover:text-accent transition-colors duration-300"
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
          className="text-sm text-text-muted hover:text-accent transition-colors duration-300 inline-flex items-center gap-1.5 group"
        >
          {children}
          <svg
            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M7 17L17 7M7 7h10v10" />
          </svg>
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="text-sm text-text-muted hover:text-accent transition-colors duration-300"
      >
        {children}
      </Link>
    </li>
  );
}
