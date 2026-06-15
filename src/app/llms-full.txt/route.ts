import { getAllPosts } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { readingTime } from "@/lib/reading-time";

export const dynamic = "force-static";

export async function GET() {
  const {
    siteUrl,
    title,
    jobTitle,
    worksFor,
    linkedin,
    keybase,
    github,
    bluesky,
    email,
  } = SITE_METADATA;
  const posts = getAllPosts();

  const postLines = posts.flatMap((post) => {
    const url = withTrailingSlash(`${siteUrl}/post/${post.slug}`);
    const absoluteContent = post.content.replace(/\]\(\//g, `](${siteUrl}/`);
    return [
      "---",
      "",
      `### [${post.title}](${url})`,
      "",
      `> ${post.excerpt}`,
      "",
      `**URL:** ${url}`,
      `**Date:** ${post.date.slice(0, 10)}`,
      `**Tags:** ${post.tags?.join(", ") ?? "none"}`,
      `**Reading time:** ${readingTime(post.content)} min`,
      "",
      absoluteContent,
      "",
    ];
  });

  const lines = [
    `# ${title}`,
    "",
    `> ${jobTitle} at ${worksFor.name} sharing insights on AI, software engineering, and cloud technology.`,
    "",
    "## Contact & Reach Out",
    "",
    `- **LinkedIn**: [${linkedin.replace("https://www.", "").replace(/\/$/, "")}](${linkedin}) (preferred for professional inquiries)`,
    `- **Keybase**: [${keybase.replace("https://", "")}](${keybase}) — Best for encrypted/private messages`,
    `- **GitHub**: [${github.replace("https://", "")}](${github})`,
    `- **Bluesky**: [${bluesky.replace("https://", "")}](${bluesky})`,
    `- **PGP Key**: [${keybase.replace("https://", "").replace(/\/$/, "")}/pgp_keys.asc](${keybase.replace(/\/$/, "")}/pgp_keys.asc)`,
    `- **Email**: [${email}](mailto:${email}) — Use encrypted messages via Keybase/PGP for privacy`,
    "",
    "## Pages",
    "",
    `- [About Burak Ince](${withTrailingSlash(`${siteUrl}/me`)}): Professional profile — ${jobTitle} at ${worksFor.name} with 13+ years of experience in software engineering, AI/ML, and cloud technology.`,
    `- [Profile (llms.txt)](${siteUrl}/me/llms.txt): Full structured text: experience, skills, and certifications.`,
    "",
    "## Blog Posts",
    "",
    ...postLines,
    "---",
    "",
    "## Optional",
    "",
    `- [RSS Feed](${siteUrl}/feed.xml): Subscribe to new posts.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): Full XML sitemap.`,
    `- [Index only (llms.txt)](${siteUrl}/llms.txt): Compact index without full post content.`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
