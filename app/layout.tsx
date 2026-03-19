import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlatformProvider } from "@/contexts/PlatformContext";
import { ConceptsProvider } from "@/contexts/ConceptsContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { GamificationProvider } from "@/contexts/GamificationContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import BadgeNotification from "@/components/BadgeNotification";
import { PomodoroWidget } from "@/components/FocusModeToggle";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://codia.wizycode.fr";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "Codia — Outils IA pour développeurs",
    template: "%s | Codia",
  },
  description: "Guides pratiques, comparatifs et retours d'expérience sur les outils IA pour développeurs. Claude Code, Cursor, Copilot et plus encore.",
  metadataBase: new URL(baseUrl),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Codia",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Codia — Outils IA pour développeurs",
    description: "Guides pratiques, comparatifs et retours d'expérience sur les outils IA pour développeurs. Claude Code, Cursor, Copilot et plus encore.",
    type: "website",
    siteName: "Codia",
    locale: "fr_FR",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Codia — Outils IA pour développeurs",
    description: "Guides pratiques, comparatifs et retours d'expérience sur les outils IA pour développeurs.",
  },
  alternates: {
    canonical: baseUrl,
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "PLACEHOLDER_REPLACE_ME",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/icons/apple-touch-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Codia RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary">
        <AccessibilityProvider>
          <GamificationProvider>
            <FavoritesProvider>
              <PlatformProvider>
                <ConceptsProvider>
                  <Header />
                  <main className="flex-1 pt-20">{children}</main>
                  <Footer />
                  <BadgeNotification />
                  <PomodoroWidget />
                </ConceptsProvider>
              </PlatformProvider>
            </FavoritesProvider>
          </GamificationProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
