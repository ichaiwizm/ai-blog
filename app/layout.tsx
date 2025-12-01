import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PlatformProvider } from "@/contexts/PlatformContext";
import { ConceptsProvider } from "@/contexts/ConceptsContext";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: "AI Blog",
    template: "%s | AI Blog",
  },
  description: "Guides et bonnes pratiques pour développer avec l'intelligence artificielle",
  metadataBase: new URL(baseUrl),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Blog",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "AI Blog",
    description: "Guides et bonnes pratiques pour développer avec l'intelligence artificielle",
    type: "website",
    siteName: "AI Blog",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
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
          title="AI Blog RSS Feed"
          href="/feed.xml"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-primary">
        <PlatformProvider>
          <ConceptsProvider>
            <Header />
            <main className="flex-1 pt-20">{children}</main>
            <Footer />
          </ConceptsProvider>
        </PlatformProvider>
      </body>
    </html>
  );
}
