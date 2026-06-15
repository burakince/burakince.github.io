import { getAllPosts, getAllTags } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  const { tag } = await params;
  const { siteUrl, author } = SITE_METADATA;
  const posts = getAllPosts().filter((p) => p.tags?.includes(tag));

  const postLines = posts.map(
    (post) =>
      `- [${post.title}](${withTrailingSlash(`${siteUrl}/post/${post.slug}`)}): ${post.excerpt}`
  );

  const lines = [
    `# Posts tagged #${tag}`,
    "",
    `${posts.length} ${posts.length === 1 ? "post" : "posts"} tagged #${tag} on ${author}'s engineering blog.`,
    "",
    ...postLines,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
