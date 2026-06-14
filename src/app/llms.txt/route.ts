import { getAllPosts } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";

export const dynamic = "force-static";

export async function GET() {
  const { siteUrl, title, jobTitle, worksFor, linkedin, keybase, github, bluesky, email } = SITE_METADATA;
  const posts = getAllPosts();

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
    "",
    "## Blog Posts",
    "",
    ...posts.map((post) => `- [${post.title}](${withTrailingSlash(`${siteUrl}/post/${post.slug}`)}): ${post.excerpt}`),
    "",
    "## Optional",
    "",
    `- [RSS Feed](${siteUrl}/feed.xml): Subscribe to new posts.`,
    `- [Sitemap](${siteUrl}/sitemap.xml): Full XML sitemap.`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
