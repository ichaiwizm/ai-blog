"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      // Add background when scrolled
      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled
          ? "bg-bg-primary/95 backdrop-blur-md border-b border-border-light shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container-wide h-20 flex items-center justify-between">
        {/* Logo - Editorial */}
        <Link href="/" className="group flex items-center gap-4">
          <div className="relative">
            {/* Angular logo box */}
            <div
              className="w-14 h-14 bg-accent flex items-center justify-center transition-all duration-300 group-hover:bg-text-primary"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)' }}
            >
              <span className="font-display text-xl font-bold text-text-inverse tracking-tighter">
                AI
              </span>
            </div>

            {/* Decorative corner */}
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-2 border-accent group-hover:border-text-primary transition-colors" />
          </div>

          <div className="hidden sm:block">
            <div className="font-display text-2xl text-text-primary group-hover:text-accent transition-colors">
              Journal
            </div>
            <div className="font-mono text-[10px] text-text-muted uppercase tracking-[0.2em]">
              Technique
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
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
            className="hidden md:block nav-link"
            title="RSS Feed"
          >
            RSS
          </a>
          <div className="w-px h-6 bg-border-light hidden md:block" />
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
    <Link href={href} className={`nav-link ${active ? "active" : ""}`}>
      {children}
    </Link>
  );
}
