import { getAllPosts, getPostBySlug } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { Params } from "@/interfaces/post";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const url = withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${slug}`);

  const frontMatter = [
    "---",
    `title: "${post.title.replace(/"/g, '\\"')}"`,
    `date: "${post.date}"`,
    `lastModified: "${post.lastModified}"`,
    `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
    `url: "${url}"`,
    "tags:",
    ...post.tags.map((t) => `  - ${t}`),
    "---",
  ].join("\n");

  const body = post.content.replace(/\]\(\//g, `](${SITE_METADATA.siteUrl}/`);

  return new Response(`${frontMatter}\n\n${body}`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
