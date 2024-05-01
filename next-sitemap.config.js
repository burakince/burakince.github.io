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
          "/*.js$",
        ],
      },
    ],
  },
  trailingSlash: true,
  output: "export",
};
