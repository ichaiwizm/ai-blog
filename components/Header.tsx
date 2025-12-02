"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useGamification } from "@/contexts/GamificationContext";
import { usePlatform, Platform, PLATFORMS } from "@/contexts/PlatformContext";

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
              <CloseIcon />
            ) : (
              <MenuIcon />
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

// ─────────────────────────────────────────────────────────────────────────────
// Focus Mode Wrapper
// ─────────────────────────────────────────────────────────────────────────────

function FocusModeWrapper({ children }: { children: React.ReactNode }) {
  const { focusMode } = useAccessibility();

  if (focusMode) {
    return null;
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation Link
// ─────────────────────────────────────────────────────────────────────────────

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
      className={`
        px-3 lg:px-4 py-2 font-body text-sm font-semibold uppercase tracking-wide
        border-b-3 transition-all duration-150
        ${active
          ? "text-text-primary border-accent"
          : "text-text-muted border-transparent hover:text-text-primary hover:border-border"
        }
      `}
    >
      {children}
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Explore Dropdown (Parcours, Glossaire, Séries)
// ─────────────────────────────────────────────────────────────────────────────

function ExploreDropdown({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = pathname.startsWith("/parcours") ||
                   pathname.startsWith("/glossaire") ||
                   pathname.startsWith("/series");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    { href: "/parcours", label: "Parcours", desc: "Chemins d'apprentissage" },
    { href: "/glossaire", label: "Glossaire", desc: "Définitions clés" },
    { href: "/series", label: "Séries", desc: "Articles liés" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          px-3 lg:px-4 py-2 font-body text-sm font-semibold uppercase tracking-wide
          border-b-3 transition-all duration-150 flex items-center gap-1
          ${isActive
            ? "text-text-primary border-accent"
            : "text-text-muted border-transparent hover:text-text-primary hover:border-border"
          }
        `}
      >
        Explorer
        <ChevronIcon className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`
                block px-4 py-3 border-b-2 border-border-light last:border-b-0
                transition-colors hover:bg-bg-tertiary
                ${pathname.startsWith(item.href) ? "bg-accent/10" : ""}
              `}
            >
              <span className="block font-body font-semibold text-sm text-text-primary">
                {item.label}
              </span>
              <span className="block font-mono text-xs text-text-muted mt-0.5">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Dropdown (Font, Platform, Focus Mode)
// ─────────────────────────────────────────────────────────────────────────────

function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { fontSize, setFontSize, contrastMode, setContrastMode, focusMode, toggleFocusMode, isLoaded } = useAccessibility();
  const { platform, setPlatform, isLoaded: platformLoaded } = usePlatform();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted || !isLoaded || !platformLoaded) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  const fontSizes = [
    { value: "small" as const, label: "S" },
    { value: "normal" as const, label: "M" },
    { value: "large" as const, label: "L" },
    { value: "xlarge" as const, label: "XL" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
        aria-label="Préférences"
        title="Préférences"
      >
        <SettingsIcon />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          <div className="p-4 border-b-2 border-border-light">
            <h3 className="font-display text-lg text-text-primary">Préférences</h3>
          </div>

          <div className="p-4 space-y-5">
            {/* Font Size */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
                Taille du texte
              </label>
              <div className="flex gap-1">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFontSize(size.value)}
                    className={`
                      flex-1 py-2 border-3 font-body font-bold transition-all
                      ${fontSize === size.value
                        ? "border-accent bg-accent text-text-inverse"
                        : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                      }
                    `}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
                Contraste
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setContrastMode("normal")}
                  className={`
                    flex-1 py-2 px-3 border-3 text-sm font-semibold transition-all
                    ${contrastMode === "normal"
                      ? "border-accent bg-accent text-text-inverse"
                      : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                    }
                  `}
                >
                  Normal
                </button>
                <button
                  onClick={() => setContrastMode("high")}
                  className={`
                    flex-1 py-2 px-3 border-3 text-sm font-semibold transition-all
                    ${contrastMode === "high"
                      ? "border-accent bg-accent text-text-inverse"
                      : "border-border bg-bg-tertiary text-text-muted hover:border-accent"
                    }
                  `}
                >
                  Élevé
                </button>
              </div>
            </div>

            {/* Platform */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
                Plateforme
              </label>
              <div className="flex gap-1">
                {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(
                  ([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setPlatform(key)}
                      className={`
                        flex-1 py-2 border-3 text-lg transition-all
                        ${platform === key
                          ? "border-accent bg-accent"
                          : "border-border bg-bg-tertiary hover:border-accent"
                        }
                      `}
                      title={value.label}
                    >
                      {value.icon}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Focus Mode */}
            <button
              onClick={() => {
                toggleFocusMode();
                setIsOpen(false);
              }}
              className={`
                w-full py-3 px-4 border-3 font-body font-semibold text-sm
                flex items-center justify-center gap-2 transition-all
                ${focusMode
                  ? "border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                  : "border-border bg-bg-tertiary text-text-muted hover:border-accent hover:text-text-primary"
                }
              `}
            >
              <FocusIcon />
              {focusMode ? "Quitter le mode zen" : "Mode zen"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// User Menu (Dashboard, Favoris, Streak)
// ─────────────────────────────────────────────────────────────────────────────

function UserMenu({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { stats, currentLevel, isLoaded } = useGamification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted || !isLoaded) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  const hasStreak = stats.currentStreak > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm"
        aria-label="Mon compte"
        title="Mon compte"
      >
        <UserIcon />
        {hasStreak && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-border text-[10px] font-mono font-bold flex items-center justify-center">
            {stats.currentStreak > 99 ? "99" : stats.currentStreak}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-bg-secondary border-3 border-border shadow-brutal z-50">
          {/* Streak Banner */}
          {hasStreak && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border-b-3 border-border">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 dark:text-amber-400">
                  {stats.currentStreak >= 30 ? <DiamondIcon size={28} /> : stats.currentStreak >= 7 ? <LightningIcon size={28} /> : <FlameIcon size={28} />}
                </span>
                <div>
                  <div className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.currentStreak}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-text-muted">
                    jours consécutifs
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 transition-colors
                ${pathname === "/dashboard" ? "bg-accent/10 text-accent" : "hover:bg-bg-tertiary text-text-primary"}
              `}
            >
              <DashboardIcon />
              <span className="font-body font-semibold text-sm">Dashboard</span>
            </Link>
            <Link
              href="/favoris"
              onClick={() => setIsOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 transition-colors
                ${pathname === "/favoris" ? "bg-accent/10 text-accent" : "hover:bg-bg-tertiary text-text-primary"}
              `}
            >
              <HeartIcon />
              <span className="font-body font-semibold text-sm">Mes favoris</span>
            </Link>
          </div>

          {/* Stats Footer */}
          <div className="p-3 border-t-2 border-border-light bg-bg-tertiary">
            <div className="flex justify-between text-xs font-mono text-text-muted">
              <span>XP: {stats.totalXP}</span>
              <span>Niveau {currentLevel.level}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Toggle Button
// ─────────────────────────────────────────────────────────────────────────────

function ThemeToggleButton() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(theme === "dark" || (!theme && prefersDark));
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  if (!mounted) {
    return <div className="w-10 h-10 border-2 border-border-light bg-bg-secondary" />;
  }

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-10 h-10 border-3 border-border bg-bg-secondary flex items-center justify-center transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-brutal-sm hover:bg-accent hover:text-text-inverse"
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Menu
// ─────────────────────────────────────────────────────────────────────────────

function MobileMenu({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  const { stats, isLoaded } = useGamification();
  const [showPrefs, setShowPrefs] = useState(false);

  return (
    <div className="md:hidden bg-bg-primary border-t-3 border-border">
      <nav className="container-default py-4">
        {/* Primary Navigation */}
        <div className="space-y-1 mb-4">
          <MobileNavLink href="/" active={pathname === "/"}>
            Accueil
          </MobileNavLink>
          <MobileNavLink href="/blog" active={pathname.startsWith("/blog")}>
            Articles
          </MobileNavLink>
          <MobileNavLink href="/concepts" active={pathname.startsWith("/concepts")}>
            Concepts
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* Secondary Navigation */}
        <div className="space-y-1 mb-4">
          <MobileNavLink href="/parcours" active={pathname.startsWith("/parcours")}>
            Parcours
          </MobileNavLink>
          <MobileNavLink href="/glossaire" active={pathname.startsWith("/glossaire")}>
            Glossaire
          </MobileNavLink>
          <MobileNavLink href="/series" active={pathname.startsWith("/series")}>
            Séries
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* User Section */}
        <div className="space-y-1 mb-4">
          {isLoaded && stats.currentStreak > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-400">
              <span className="text-amber-500 dark:text-amber-400">
                <FlameIcon size={24} />
              </span>
              <div>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-lg">
                  {stats.currentStreak}
                </span>
                <span className="text-sm text-text-muted ml-2">jours de streak</span>
              </div>
            </div>
          )}
          <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
            Dashboard
          </MobileNavLink>
          <MobileNavLink href="/favoris" active={pathname === "/favoris"}>
            Mes favoris
          </MobileNavLink>
        </div>

        <div className="h-[3px] bg-border my-4" />

        {/* Preferences Accordion */}
        <div>
          <button
            onClick={() => setShowPrefs(!showPrefs)}
            className="flex items-center justify-between w-full px-4 py-3 text-left font-body font-semibold text-text-muted"
          >
            Préférences
            <ChevronIcon className={`transition-transform ${showPrefs ? "rotate-180" : ""}`} />
          </button>

          {showPrefs && (
            <div className="px-4 py-4 bg-bg-tertiary border-l-4 border-border">
              <MobileSettingsPanel />
            </div>
          )}
        </div>
      </nav>
    </div>
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
        flex items-center min-h-[48px] px-4 py-3 font-body font-semibold transition-colors
        ${active
          ? "bg-accent/10 text-accent border-l-4 border-accent"
          : "text-text-body hover:bg-bg-tertiary border-l-4 border-transparent"
        }
      `}
    >
      {children}
    </Link>
  );
}

function MobileSettingsPanel() {
  const { fontSize, setFontSize, contrastMode, setContrastMode, focusMode, toggleFocusMode, isLoaded } = useAccessibility();
  const { platform, setPlatform, isLoaded: platformLoaded } = usePlatform();
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(theme === "dark" || (!theme && prefersDark));
  }, []);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [isDark, mounted]);

  if (!mounted || !isLoaded || !platformLoaded) return null;

  return (
    <div className="space-y-4">
      {/* Theme */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Thème
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDark(false)}
            className={`flex-1 py-2 border-3 font-semibold ${!isDark ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Clair
          </button>
          <button
            onClick={() => setIsDark(true)}
            className={`flex-1 py-2 border-3 font-semibold ${isDark ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Sombre
          </button>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Taille texte
        </label>
        <div className="flex gap-1">
          {(["small", "normal", "large", "xlarge"] as const).map((size, i) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex-1 py-2 border-3 font-bold ${fontSize === size ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
            >
              {["S", "M", "L", "XL"][i]}
            </button>
          ))}
        </div>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Plateforme
        </label>
        <div className="flex gap-1">
          {(Object.entries(PLATFORMS) as [Platform, typeof PLATFORMS[Platform]][]).map(
            ([key, value]) => (
              <button
                key={key}
                onClick={() => setPlatform(key)}
                className={`flex-1 py-2 border-3 text-xl ${platform === key ? "border-accent bg-accent" : "border-border bg-bg-secondary"}`}
                title={value.label}
              >
                {value.icon}
              </button>
            )
          )}
        </div>
      </div>

      {/* Contrast */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-text-muted mb-2 font-mono">
          Contraste
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setContrastMode("normal")}
            className={`flex-1 py-2 border-3 font-semibold ${contrastMode === "normal" ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Normal
          </button>
          <button
            onClick={() => setContrastMode("high")}
            className={`flex-1 py-2 border-3 font-semibold ${contrastMode === "high" ? "border-accent bg-accent text-text-inverse" : "border-border bg-bg-secondary"}`}
          >
            Élevé
          </button>
        </div>
      </div>

      {/* Focus Mode */}
      <button
        onClick={toggleFocusMode}
        className={`w-full py-3 border-3 font-semibold flex items-center justify-center gap-2 ${
          focusMode
            ? "border-amber-500 bg-amber-100 dark:bg-amber-900/50 text-amber-700"
            : "border-border bg-bg-secondary text-text-muted"
        }`}
      >
        <FocusIcon />
        {focusMode ? "Quitter le mode zen" : "Mode zen"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons (SVG)
// ─────────────────────────────────────────────────────────────────────────────

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

// Sliders icon for settings (distinct from sun icon)
function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function FocusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// Streak Icons
function FlameIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.532 1.368-4.758 3.403-5.962-.168.772-.249 1.572-.249 2.391 0 3.866 3.134 7 7 7 .896 0 1.751-.168 2.539-.476C16.343 21.271 14.336 23 12 23zm6.305-7.014c.188-.654.291-1.343.291-2.057 0-4.97-5.83-8.929-5.83-8.929s1.434 2.143 1.434 4.786c0 2.643-2.143 4.786-4.786 4.786-2.643 0-4.786-2.143-4.786-4.786 0-.965.286-1.864.778-2.616C3.582 8.969 2 11.366 2 14.143 2 19.022 6.477 23 12 23c4.97 0 9.061-3.301 9.9-7.614-.514.382-1.083.707-1.695.966l.1-.366z"/>
    </svg>
  );
}

function LightningIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );
}

function DiamondIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.5 2h11L22 8.5 12 22 2 8.5 6.5 2zm.79 2L4.5 8.5 12 19l7.5-10.5L16.71 4H7.29z"/>
      <path d="M7.29 4l-.79 4.5h11L16.71 4H7.29z" opacity="0.5"/>
    </svg>
  );
}
