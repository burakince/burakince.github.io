import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import Container from "@/app/_components/container";
import { SITE_METADATA } from "@/lib/site-metadata";
import type { Metadata, Viewport } from "next";
import Head from "next/head";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

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
  robots: "index, follow",
  keywords: [
    "latest tech trends",
    "technology updates",
    "emerging technologies",
    "software engineering",
    "programming languages",
    "coding best practices",
    "AI developments",
    "machine learning",
    "deep learning",
    "cybersecurity tips",
    "data protection",
    "security threats",
    "latest gadgets",
    "tech reviews",
    "device comparisons",
    "tech industry updates",
    "technology news",
    "tech market trends",
    "tech tutorials",
    "coding tutorials",
    "software guides",
    "product reviews",
    "technology product reviews",
    "tech gadgets reviews",
    "cloud technology",
    "cloud services",
    "cloud solutions",
    "tech innovation",
    "tech breakthroughs",
    "innovative tech ideas",
  ],
  openGraph: {
    type: "website",
    url: "https://www.burakince.com",
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.description,
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
    apple: {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/apple-touch-icon.png",
    },
    other: [
      {
        rel: "mask-icon",
        color: "#000000",
        url: "/favicon/safari-pinned-tab.png",
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
      <Head>
        <meta name="robots" content="all" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="msapplication-config"
          content="/favicon/browserconfig.xml"
        />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      </Head>
      <body className={`bg-slate-100 dark:bg-slate-800 ${inter.className}`}>
        <Container>
          <Header />
          <div>{children}</div>
          <Footer />
        </Container>
      </body>
      <GoogleAnalytics
        gaId={SITE_METADATA.analytics.googleAnalytics.googleAnalyticsId}
      />
    </html>
  );
}
