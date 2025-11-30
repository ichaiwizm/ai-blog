import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Newsletter section */}
        <div className="mb-12 pb-12 border-b border-[var(--border)]">
          <div className="max-w-md">
            <NewsletterForm />
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-mono text-xs text-[var(--accent)] mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/blog" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/series" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Series
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs text-[var(--accent)] mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/tutoriels" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Tutoriels
                </Link>
              </li>
              <li>
                <Link href="/category/actualites" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Actualites
                </Link>
              </li>
              <li>
                <Link href="/category/opinions" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Opinions
                </Link>
              </li>
              <li>
                <Link href="/category/comparatifs" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Comparatifs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs text-[var(--accent)] mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/feed.xml" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Flux RSS
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors">
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-xs text-[var(--accent)] mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-[var(--border)]">
          <div className="font-mono text-xs text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">&gt;</span> AI Blog &copy; {new Date().getFullYear()}
          </div>
          <div className="font-mono text-xs text-[var(--text-muted)]">
            Deploye sur{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              Vercel
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
