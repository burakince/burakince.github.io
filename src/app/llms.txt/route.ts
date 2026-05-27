import { getAllPosts } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";

export const dynamic = "force-static";

export async function GET() {
  const { siteUrl, title, jobTitle, worksFor, linkedin, keybase, github, email } = SITE_METADATA;
  const posts = getAllPosts();

  const lines = [
    `# ${title}`,
    "",
    `> ${jobTitle} at ${worksFor.name} sharing insights on AI, software engineering, and cloud technology.`,
    "",
    "## Pages",
    "",
    `- [About Burak Ince](${siteUrl}/me/): Professional profile — ${jobTitle} at ${worksFor.name} with 13+ years of experience in software engineering, AI/ML, and cloud technology.`,
    "",
    "## Contact & Reach Out",
    "",
    `- **LinkedIn**: [${linkedin.replace("https://", "")}](${linkedin}) (preferred for professional inquiries)`,
    `- **Keybase**: [${keybase.replace("https://", "")}](${keybase}) — Best for encrypted/private messages`,
    `- **GitHub**: [${github.replace("https://", "")}](${github})`,
    `- **PGP Key**: [${keybase.replace("https://", "")}/pgp_keys.asc](${keybase}/pgp_keys.asc)`,
    `- **Email**: [${email}](mailto:${email}) — Use encrypted messages via Keybase/PGP for privacy`,
    "",
    "## Blog Posts",
    "",
    ...posts.map((post) => `- [${post.title}](${siteUrl}/post/${post.slug}/): ${post.excerpt}`),
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
