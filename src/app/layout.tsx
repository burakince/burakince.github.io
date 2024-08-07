import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Container from "@/app/_components/container";
import { SITE_METADATA } from "@/lib/site-metadata";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f5f9" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  title: SITE_METADATA.title,
  description: SITE_METADATA.description,
  category: "technology",
  creator: SITE_METADATA.author,
  publisher: SITE_METADATA.author,
  robots: {
    index: true,
    follow: true,
  },
  keywords: SITE_METADATA.keywords,
  alternates: {
    canonical: SITE_METADATA.siteUrl,
  },
  openGraph: {
    type: "website",
    images: [`${SITE_METADATA.siteUrl}/assets/open-graph-image.jpg`],
    url: SITE_METADATA.siteUrl,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    emails: SITE_METADATA.email,
    siteName: SITE_METADATA.description,
    locale: SITE_METADATA.locale,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@burakinc",
    images: [`${SITE_METADATA.siteUrl}/assets/open-graph-image.jpg`],
  },
  icons: {
    icon: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/favicon/favicon-16x16.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/favicon/favicon-32x32.png",
      },
    ],
    shortcut: {
      rel: "shortcut icon",
      url: "/favicon/favicon.ico",
    },
    apple: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        url: "/favicon/apple-touch-icon.png",
      },
      {
        rel: "apple-touch-icon-60x60",
        sizes: "60x60",
        url: "/favicon/apple-touch-icon-60x60.png",
      },
      {
        rel: "apple-touch-icon-76x76",
        sizes: "76x76",
        url: "/favicon/apple-touch-icon-76x76.png",
      },
      {
        rel: "apple-touch-icon-120x120",
        sizes: "120x120",
        url: "/favicon/apple-touch-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon-152x152",
        sizes: "152x152",
        url: "/favicon/apple-touch-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon-180x180",
        sizes: "180x180",
        url: "/favicon/apple-touch-icon-180x180.png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        color: "#000000",
        url: "/favicon/safari-pinned-tab.svg",
      },
      {
        type: "image/png",
        sizes: "192x192",
        url: "/favicon/android-chrome-192x192.png",
      },
      {
        type: "image/png",
        sizes: "512x512",
        url: "/favicon/android-chrome-512x512.png",
      },
    ],
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="msapplication-TileColor" content="#2c3e50" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </head>
      <body className={`bg-slate-100 dark:bg-slate-800 ${inter.className}`}>
        <Container>
          <Header />
          <main>{children}</main>
          <Footer />
        </Container>
      </body>
      <GoogleAnalytics
        gaId={SITE_METADATA.analytics.googleAnalytics.googleAnalyticsId}
      />
    </html>
  );
}
