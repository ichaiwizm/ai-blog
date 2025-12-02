import Link from "next/link";

interface NavLinkProps {
  href: string;
  active: boolean;
  children: React.ReactNode;
}

export function NavLink({ href, active, children }: NavLinkProps) {
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

export function MobileNavLink({
  href,
  active,
  children,
}: NavLinkProps) {
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
