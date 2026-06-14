import { Feed } from "feed";
import { getAllPosts } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";

export const dynamic = "force-static";

export async function GET() {
  const { siteUrl, title, description, author, email } = SITE_METADATA;

  const feed = new Feed({
    title,
    description,
    id: withTrailingSlash(siteUrl),
    link: withTrailingSlash(siteUrl),
    language: "en-US",
    image: `${siteUrl}/assets/open-graph-image.jpg`,
    favicon: `${siteUrl}/favicon/favicon-32x32.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author}`,
    author: { name: author, email, link: withTrailingSlash(`${siteUrl}/me`) },
    feedLinks: { rss: `${siteUrl}/feed.xml` },
  });

  for (const post of getAllPosts()) {
    const url = withTrailingSlash(`${siteUrl}/post/${post.slug}`);
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      date: new Date(post.date),
      author: [{ name: author, email, link: withTrailingSlash(`${siteUrl}/me`) }],
    });
  }

  return new Response(feed.rss2(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
