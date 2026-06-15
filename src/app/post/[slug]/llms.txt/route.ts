import { getAllPosts, getPostBySlug } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { readingTime } from "@/lib/reading-time";
import { Params } from "@/interfaces/post";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Params }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const url = withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${slug}`);
  const absoluteContent = post.content.replace(
    /\]\(\//g,
    `](${SITE_METADATA.siteUrl}/`
  );

  const lines = [
    `# ${post.title}`,
    "",
    `> ${post.excerpt}`,
    "",
    `**URL:** ${url}`,
    `**Date:** ${post.date.slice(0, 10)}`,
    `**Tags:** ${post.tags?.join(", ") ?? "none"}`,
    `**Reading time:** ${readingTime(post.content)} min`,
    "",
    "---",
    "",
    absoluteContent,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
