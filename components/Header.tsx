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

      // Add glassmorphism when scrolled
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
          ? "glass border-b border-border-light shadow-soft-md backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="container-default h-20 flex items-center justify-between">
        {/* Logo - Elegant and refined */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative w-11 h-11 bg-gradient-to-br from-accent to-accent-hover rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-glow">
            <span className="font-display text-xl font-bold text-text-inverse tracking-tight">
              AI
            </span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-2xl font-semibold text-text-primary tracking-tight">
              Blog
            </span>
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
