# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Node version

Always use the Node version specified in `.nvmrc` (currently Node 24):

```bash
nvm use
```

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production (runs next-sitemap as postbuild)
npm run lint       # ESLint (next + next/core-web-vitals + prettier rules)
```

Some issues (static export errors, OG image generation, sitemap) are only visible in the production build. To verify them locally, build first then serve the output:

```bash
npm run build
npx serve@latest out
```

There is no test suite.

## Architecture

Personal blog/portfolio site built with Next.js 15 App Router, exported as a fully static site (`output: "export"`) and deployed to GitHub Pages via `.github/workflows/pages.yml`.

### Deployment

The site is built and deployed automatically via GitHub Actions (`.github/workflows/pages.yml`) on every push to `main`:

1. `npm run build` produces a fully static export in `out/`
2. The `out/` directory is uploaded as a GitHub Pages artifact and deployed to GitHub Pages
3. The `CNAME` file (containing `www.burakince.com`) tells GitHub Pages the custom domain to serve the site under
4. Traffic is proxied through **Cloudflare** (CDN, DDoS protection, SSL termination)

Implications for development:
- Cloudflare caches static assets aggressively; a cache purge may be needed after deploying changes to images or other long-lived files.
- There is no server — everything must be statically exportable at build time.

### File placement conventions

| Location | What goes there |
|---|---|
| `public/` | All static assets (images, favicons, fonts referenced via URL, OG images) |
| `_posts/` | Blog post Markdown files only — nothing else |
| `src/` | All website source code (pages, components, libs, interfaces, styles) |

Do not place source files outside `src/`, static assets outside `public/`, or non-post files inside `_posts/`.

### Key directories

- `_posts/` — Markdown blog posts parsed at build time via gray-matter. Each file becomes a route at `/post/<slug>/`.
- `src/app/` — Next.js App Router pages and shared components
  - `_components/` — Header, footer, container, post-preview, OG template, JSON-LD, social icons, date formatter
  - `post/[slug]/page.tsx` — Dynamic post page; uses `generateStaticParams` to enumerate all posts
  - `me/page.tsx` — About/profile page
- `src/lib/` — Core utilities
  - `api.ts` — Filesystem helpers (`getAllPosts`, `getPostBySlug`) that read `_posts/`
  - `markdownToHtml.ts` — Unified/remark/rehype pipeline with `rehype-highlight` for syntax highlighting
  - `og-generator.ts` — Generates OG images as PNGs using satori + resvg-js; images are written to `public/assets/blog/og-images/` and skipped if already present
  - `site-metadata.ts` — Single source of truth for site-wide config (author, URLs, analytics ID)
- `src/interfaces/` — TypeScript types (`Post`, `Params`)
- `fonts/` — Inter font files required by `og-generator.ts` at build time

### Important behaviors

- **Static export**: No server components that rely on runtime APIs. `trailingSlash: true` is set, so all routes end with `/`.
- **OG image caching**: `og-generator.ts` checks whether the PNG already exists before generating. During development this can mean stale images; delete `public/assets/blog/og-images/` to force regeneration.
- **SVGs as React components**: SVG files are imported directly as components via `@svgr/webpack`.
- **Path alias**: `@/*` maps to `src/*`.
- **Styling**: Use Tailwind CSS utility classes for all styling — do not write custom CSS unless unavoidable. Global styles live in `src/app/globals.css`.
- **Dark mode**: Tailwind CSS v4 `dark:` variants driven by system `prefers-color-scheme`.
- **Typography**: `@tailwindcss/typography` (`prose` classes) is used for rendered Markdown content.

### Adding a blog post

Create a Markdown file in `_posts/` named with kebab-case and a `.md` extension (e.g. `my-post-title.md`). The filename becomes the URL slug. Required front matter:

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
keywords:
  - keyword one
  - keyword two
---
```

An OG image is generated automatically on the next build.
