import { getAllPosts } from "@/lib/api";
import { SITE_METADATA } from "@/lib/site-metadata";
import { SKILL_CATEGORIES_SORTED } from "@/lib/skills";
import { withTrailingSlash } from "@/lib/url";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const { author, jobTitle, worksFor, siteUrl, github, linkedin, twitter, bluesky } =
    SITE_METADATA;

  const recentPosts = posts.slice(0, 5).map((post) => ({
    title: post.title,
    url: withTrailingSlash(`${siteUrl}/post/${post.slug}`),
    date: post.date,
    tags: post.tags,
    excerpt: post.excerpt,
  }));

  const skillCategories = SKILL_CATEGORIES_SORTED.map(({ label, items }) => ({
    label,
    items: [...items],
  }));

  const payload = {
    version: process.env.GITHUB_SHA ?? "local",
    name: author,
    jobTitle,
    company: worksFor.name,
    companyUrl: worksFor.url,
    siteUrl,
    socialLinks: {
      github,
      linkedin,
      twitter,
      bluesky,
    },
    recentPosts,
    skillCategories,
  };

  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
