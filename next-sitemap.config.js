const matter = require("gray-matter");
const fs = require("fs");
const path = require("path");

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
          "/*.json$",
          "/*_buildManifest.js$",
          "/*_middlewareManifest.js$",
          "/*_ssgManifest.js$",
        ],
      },
    ],
  },
  exclude: ["/404", "/404/"],
  trailingSlash: true,
  output: "export",
  transform: async (config, url) => {
    const postMatch = url.match(/\/post\/([^/]+)\//);
    if (postMatch) {
      const slug = postMatch[1];
      const filePath = path.join(process.cwd(), "_posts", `${slug}.md`);
      try {
        const { data } = matter(fs.readFileSync(filePath, "utf8"));
        return {
          loc: url,
          lastmod: new Date(data.date).toISOString(),
          changefreq: "monthly",
          priority: 0.8,
        };
      } catch {}
    }
    const isHome = url === "/" || url === "";
    return {
      loc: url,
      lastmod: new Date().toISOString(),
      changefreq: isHome ? "weekly" : "monthly",
      priority: isHome ? 0.9 : 0.7,
    };
  },
};
