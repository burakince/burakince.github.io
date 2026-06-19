const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

function matter(input) {
  const match = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: input };
  return { data: yaml.load(match[1]) ?? {}, content: match[2] };
}

const postsDir = path.join(process.cwd(), "_posts");
const postFiles = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));

let latestPostDate = new Date(0);
const tagLatestDate = {};
const postLastModified = {};

for (const file of postFiles) {
  const { data } = matter(fs.readFileSync(path.join(postsDir, file), "utf8"));
  const slug = file.replace(/\.md$/, "");
  const modDate = new Date(data.lastModified ?? data.date);
  postLastModified[slug] = modDate.toISOString();
  if (modDate > latestPostDate) latestPostDate = modDate;
  for (const tag of data.tags || []) {
    if (!tagLatestDate[tag] || modDate > new Date(tagLatestDate[tag])) {
      tagLatestDate[tag] = modDate.toISOString();
    }
  }
}

const latestPostDateStr = latestPostDate.toISOString();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://www.burakince.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cdn-cgi/",
          "/*.json$",
          "/*_buildManifest.js$",
          "/*_middlewareManifest.js$",
          "/*_ssgManifest.js$",
        ],
      },
      { userAgent: "GPTBot",                 allow: "/" },
      { userAgent: "ChatGPT-User",           allow: "/" },
      { userAgent: "OAI-SearchBot",          allow: "/" },
      { userAgent: "ClaudeBot",              allow: "/" },
      { userAgent: "anthropic-ai",           allow: "/" },
      { userAgent: "Claude-SearchBot",       allow: "/" },
      { userAgent: "Claude-User",            allow: "/" },
      { userAgent: "PerplexityBot",          allow: "/" },
      { userAgent: "Perplexity-User",        allow: "/" },
      { userAgent: "Google-Extended",        allow: "/" },
      { userAgent: "Googlebot",              allow: "/" },
      { userAgent: "Google-CloudVertexBot",  allow: "/" },
      { userAgent: "Amazonbot",              allow: "/" },
      { userAgent: "Meta-ExternalAgent",     allow: "/" },
      { userAgent: "Meta-ExternalFetcher",   allow: "/" },
      { userAgent: "FacebookBot",            allow: "/" },
      { userAgent: "FacebookExternalHit",    allow: "/" },
      { userAgent: "cohere-ai",              allow: "/" },
      { userAgent: "Bytespider",             allow: "/" },
      { userAgent: "TikTok Spider",          allow: "/" },
      { userAgent: "CCBot",                  allow: "/" },
      { userAgent: "Applebot",               allow: "/" },
      { userAgent: "Applebot-Extended",      allow: "/" },
      { userAgent: "Bingbot",                allow: "/" },
      { userAgent: "DuckAssistBot",          allow: "/" },
      { userAgent: "MistralAI-User",         allow: "/" },
      { userAgent: "PetalBot",               allow: "/" },
      { userAgent: "Timpibot",               allow: "/" },
      { userAgent: "Manus Bot",              allow: "/" },
    ],
  },
  exclude: ["/404", "/404/", "/profile.json", "/me/content.md", "/me/content.md/"],
  trailingSlash: true,
  output: "export",
  transform: async (config, url) => {
    const postMatch = url.match(/\/post\/([^/]+)\//);
    if (postMatch) {
      const slug = postMatch[1];
      return {
        loc: url,
        lastmod: postLastModified[slug] ?? new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      };
    }

    const tagMatch = url.match(/\/tag\/([^/]+)\//);
    if (tagMatch) {
      const tag = tagMatch[1];
      return {
        loc: url,
        lastmod: tagLatestDate[tag] ?? latestPostDateStr,
        changefreq: "weekly",
        priority: 0.7,
      };
    }

    const isHome = url === "/" || url === "";
    const isPostListing =
      isHome || url.startsWith("/page/") || url === "/tag/" || url === "/tag";
    return {
      loc: url,
      lastmod: isPostListing ? latestPostDateStr : new Date().toISOString(),
      changefreq: isHome ? "weekly" : "monthly",
      priority: isHome ? 0.9 : 0.7,
    };
  },
};
