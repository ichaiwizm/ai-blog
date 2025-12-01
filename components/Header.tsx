"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import PlatformSelector from "./PlatformSelector";
import UserLevelBadge from "./UserLevelBadge";
import { StreakBadge } from "./StreakDisplay";
import FocusModeToggle from "./FocusModeToggle";
import FontSizeControls from "./FontSizeControls";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Check focus mode
  const AccessibilityWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!mounted) return <>{children}</>;
    return <FocusModeWrapper>{children}</FocusModeWrapper>;
  };

  return (
    <AccessibilityWrapper>
      <header
        className={`header-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "bg-bg-primary border-b-3 border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container-default h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-4">
            <div className="w-12 h-12 bg-accent border-3 border-border flex items-center justify-center transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-brutal-sm">
              <span className="font-body text-lg font-bold text-text-inverse tracking-tight">
                AI
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-2xl text-text-primary">
                Blog
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <NavLink href="/" active={pathname === "/"}>
              Accueil
            </NavLink>
            <NavLink href="/blog" active={pathname.startsWith("/blog")}>
              Articles
            </NavLink>
            <NavLink href="/concepts" active={pathname.startsWith("/concepts")}>
              Concepts
            </NavLink>
            <NavLink href="/parcours" active={pathname.startsWith("/parcours")}>
              Parcours
            </NavLink>
            <NavLink href="/glossaire" active={pathname.startsWith("/glossaire")}>
              Glossaire
            </NavLink>

            <div className="w-px h-6 bg-border-light" />

            {/* User section */}
            <div className="flex items-center gap-3">
              <StreakBadge />
              <Link
                href="/dashboard"
                className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}
                title="Mon tableau de bord"
              >
                <span className="flex items-center gap-1">
                  <span>📊</span>
                  <span className="hidden xl:inline">Dashboard</span>
                </span>
              </Link>
              <Link
                href="/favoris"
                className={`nav-link ${pathname === "/favoris" ? "active" : ""}`}
                title="Mes favoris"
              >
                ♥
              </Link>
            </div>

            <div className="w-px h-6 bg-border-light" />

            {/* Tools */}
            <div className="flex items-center gap-2">
              <FocusModeToggle />
              <FontSizeControls />
              <PlatformSelector />
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 border-2 border-border bg-bg-secondary flex items-center justify-center"
            aria-label="Menu"
          >
            <span className="text-xl">{mobileMenuOpen ? "✕" : "☰"}</span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-bg-primary border-t-3 border-border">
            <nav className="container-default py-4 flex flex-col gap-2">
              <MobileNavLink href="/" active={pathname === "/"}>
                🏠 Accueil
              </MobileNavLink>
              <MobileNavLink href="/blog" active={pathname.startsWith("/blog")}>
                📝 Articles
              </MobileNavLink>
              <MobileNavLink href="/concepts" active={pathname.startsWith("/concepts")}>
                📚 Concepts
              </MobileNavLink>
              <MobileNavLink href="/parcours" active={pathname.startsWith("/parcours")}>
                🗺️ Parcours
              </MobileNavLink>
              <MobileNavLink href="/glossaire" active={pathname.startsWith("/glossaire")}>
                📖 Glossaire
              </MobileNavLink>

              <div className="h-px bg-border-light my-2" />

              <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
                📊 Dashboard
              </MobileNavLink>
              <MobileNavLink href="/favoris" active={pathname === "/favoris"}>
                ♥ Mes Favoris
              </MobileNavLink>

              <div className="h-px bg-border-light my-2" />

              {/* Mobile tools */}
              <div className="flex items-center gap-2 py-2">
                <FocusModeToggle />
                <FontSizeControls />
                <PlatformSelector />
                <ThemeToggle />
              </div>
            </nav>
          </div>
        )}
      </header>
    </AccessibilityWrapper>
  );
}

function FocusModeWrapper({ children }: { children: React.ReactNode }) {
  const { focusMode } = useAccessibility();

  if (focusMode) {
    return null; // Hide header in focus mode
  }

  return <>{children}</>;
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

function MobileNavLink({
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
      className={`
        block px-4 py-3 text-base font-medium transition-colors
        ${active
          ? "bg-accent/10 text-accent border-l-4 border-accent"
          : "text-text-body hover:bg-bg-tertiary"
        }
      `}
    >
      {children}
    </Link>
  );
}
