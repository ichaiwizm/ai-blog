import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ai-blog.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "AI Blog",
    template: "%s | AI Blog",
  },
  description: "Guides et bonnes pratiques pour développer avec l'intelligence artificielle",
  metadataBase: new URL(baseUrl),
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
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
