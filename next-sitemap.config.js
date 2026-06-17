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
    transformRobotsTxt: async (_config, robotsTxt) => {
      const preamble = [
        "# As a condition of accessing this website, you",
        "# agree to abide by the following content signals:",
        "#",
        "# (a) If a content-signal = yes, you may collect",
        "# content for the corresponding use.",
        "# (b) If a content-signal = no, you may not",
        "# collect content for the corresponding use.",
        "# (c) If the website operator does not include a",
        "# content signal for a corresponding use, the",
        "# website operator neither grants nor restricts",
        "# permission via content signal with respect to",
        "# the corresponding use.",
        "#",
        "# The content signals and their meanings are:",
        "#",
        "# search: building a search index and providing",
        "# search results (e.g., returning hyperlinks and",
        "# short excerpts from your website's contents).",
        "# Search does not include providing AI-generated",
        "# search summaries.",
        "# ai-input: inputting content into one or more AI",
        "# models (e.g., retrieval augmented generation,",
        "# grounding, or other real-time taking of content",
        "# for generative AI search answers).",
        "# ai-train: training or fine-tuning AI models.",
        "#",
        "# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS",
        "# ARE EXPRESS RESERVATIONS OF RIGHTS UNDER ARTICLE",
        "# 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON",
        "# COPYRIGHT AND RELATED RIGHTS IN THE DIGITAL",
        "# SINGLE MARKET.",
        "",
      ].join("\n");
      const fixed = robotsTxt.replace(
        /(User-agent: \*\n)/,
        "$1Content-Signal: ai-train=yes, search=yes, ai-input=yes\n"
      );
      return preamble + "\n" + fixed;
    },
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
      { userAgent: "GPTBot",             allow: "/" },
      { userAgent: "ChatGPT-User",       allow: "/" },
      { userAgent: "ClaudeBot",          allow: "/" },
      { userAgent: "anthropic-ai",       allow: "/" },
      { userAgent: "PerplexityBot",      allow: "/" },
      { userAgent: "Google-Extended",    allow: "/" },
      { userAgent: "Amazonbot",          allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "cohere-ai",          allow: "/" },
      { userAgent: "Bytespider",         allow: "/" },
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
