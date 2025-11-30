"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[var(--bg-primary)]/80 border-b border-[var(--border)]">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[var(--accent)] flex items-center justify-center">
            <span className="font-mono text-sm font-bold text-[var(--bg-primary)]">AI</span>
          </div>
          <span className="font-mono text-sm tracking-tight hidden sm:block">
            <span className="text-[var(--text-muted)]">~/</span>
            <span className="text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">blog</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <NavLink href="/" active={pathname === "/"}>
            Accueil
          </NavLink>
          <NavLink href="/blog" active={pathname.startsWith("/blog")}>
            Articles
          </NavLink>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            title="RSS Feed"
          >
            RSS
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`font-mono text-xs uppercase tracking-wider transition-colors ${
        active
          ? "text-[var(--accent)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </Link>
  );
}
