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
      <head>
        <meta name="msapplication-TileColor" content="#000000" />
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
