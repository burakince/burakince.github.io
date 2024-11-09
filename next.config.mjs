/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",

  output: "export",

  reactStrictMode: true,

  images: {
    unoptimized: true,
  },

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',

  serverExternalPackages: ["@resvg/resvg-js"],

  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
