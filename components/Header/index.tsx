"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { MenuIcon, CloseIcon } from "@/components/icons";

import { NavLink } from "./NavLink";
import { ExploreDropdown } from "./ExploreDropdown";
import { SettingsDropdown } from "./SettingsDropdown";
import { UserMenu } from "./UserMenu";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { MobileMenu } from "./MobileMenu";

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

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
        <div className="container-default h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-accent border-3 border-border flex items-center justify-center transition-all group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] group-hover:shadow-brutal-sm">
              <span className="font-body text-sm sm:text-base font-bold text-text-inverse tracking-tight">
                AI
              </span>
            </div>
            <span className="font-display text-xl sm:text-2xl text-text-primary hidden xs:block">
              Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {/* Primary Navigation */}
            <NavLink href="/blog" active={pathname.startsWith("/blog")}>
              Articles
            </NavLink>
            <NavLink href="/concepts" active={pathname.startsWith("/concepts")}>
              Concepts
            </NavLink>

            {/* Explore Dropdown */}
            <ExploreDropdown pathname={pathname} />

            {/* Brutal Divider */}
            <div className="w-[3px] h-6 bg-border mx-2 lg:mx-4" />

            {/* Condensed Actions */}
            <SettingsDropdown />
            <UserMenu pathname={pathname} />
            <ThemeToggleButton />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 border-3 border-border bg-bg-secondary flex items-center justify-center touch-target hover:bg-accent hover:text-text-inverse transition-colors"
            aria-label="Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <CloseIcon size={20} />
            ) : (
              <MenuIcon size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <MobileMenu pathname={pathname} onClose={() => setMobileMenuOpen(false)} />
        )}
      </header>
    </AccessibilityWrapper>
  );
}

function FocusModeWrapper({ children }: { children: React.ReactNode }) {
  const { focusMode } = useAccessibility();

  if (focusMode) {
    return null;
  }

  return <>{children}</>;
}
