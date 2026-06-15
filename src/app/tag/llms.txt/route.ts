import { getAllPosts, getAllTags } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";

export const dynamic = "force-static";

export async function GET() {
  const { siteUrl, title } = SITE_METADATA;
  const tags = getAllTags();
  const posts = getAllPosts();

  const tagLines = tags.map((tag) => {
    const count = posts.filter((p) => p.tags?.includes(tag)).length;
    const tagUrl = withTrailingSlash(`${siteUrl}/tag/${tag}`);
    return `- [#${tag}](${tagUrl}): ${count} ${count === 1 ? "post" : "posts"} — full list: ${tagUrl}llms.txt`;
  });

  const lines = [
    `# Tags — ${title}`,
    "",
    `${tags.length} topics across ${posts.length} posts.`,
    "",
    "## All Tags",
    "",
    ...tagLines,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
