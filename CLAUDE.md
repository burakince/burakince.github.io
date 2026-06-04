# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Node version

Always use the Node version specified in `.nvmrc` (currently Node 24):

```bash
nvm use
```

## Browser testing

Always use the playwright plugin for browser-based testing and UI verification.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production (runs next-sitemap as postbuild)
npm run lint       # ESLint flat config (core-web-vitals + prettier rules); also runs in CI before build
```

Some issues (TypeScript errors, static export failures, CSS bundling, OG image generation, sitemap) are only visible in the production build and not in `npm run dev`. To verify locally:

```bash
npm run build
npx serve@latest out
```

There is no test suite.

## Before committing

Always run `npm run build` and confirm it succeeds with no errors before committing or pushing.

## Git commits

Never include `Co-Authored-By` or any Claude attribution in commit messages.

## Writing tone

Never finger-point individuals in blog posts. Do not name specific people (support agents, colleagues, vendor employees) when describing problems or negative experiences. Use impersonal phrasing instead: "the support reply," "I was told," "the response explained."

## Architecture

Personal blog/portfolio site built with Next.js 16 App Router, exported as a fully static site (`output: "export"`) and deployed to GitHub Pages via `.github/workflows/pages.yml`.

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
  - `post/_components/article-content.tsx` — `"use client"` component that renders post HTML via `dangerouslySetInnerHTML`, injects `.copy-btn` buttons into every `pre:has(code)` block after hydration, and handles clicks via `document`-level event delegation. Mermaid SVG blocks (`<svg>`) are not affected. Styles for `.copy-btn` live in `post/post.css`.
  - `me/page.tsx` — About/profile page
- `src/lib/` — Core utilities
  - `api.ts` — Filesystem helpers (`getAllPosts`, `getPostBySlug`) that read `_posts/`
  - `markdownToHtml.ts` — Unified/remark/rehype pipeline with `rehype-highlight` for syntax highlighting
  - `og-generator.ts` — Generates OG images as PNGs using satori + resvg-js; images are written to `public/assets/blog/og-images/` and skipped if already present
  - `site-metadata.ts` — Single source of truth for site-wide config (author, URLs, analytics ID)
  - `schema.ts` — Shared `orgJsonLd` (`Organization` JSON-LD object) used across all three page files
  - `skills.ts` — Single source of truth for skill categories and core concepts; exports `SKILL_CATEGORIES_SORTED` (each category's items sorted alphabetically) and `ALL_SKILLS_SORTED` (deduplicated union of all items and core concepts, sorted with `localeCompare("en")`); drives both the visible Skills section and the `knowsAbout` JSON-LD on `/me/`. Always consume the `_SORTED` exports — do not sort at call sites.
- `src/interfaces/` — TypeScript types (`Post`, `Params`); also holds module declarations (`svgr.d.ts`)
- `fonts/` — Inter font files required by `og-generator.ts` at build time

### Important behaviors

- **Static export**: No server components that rely on runtime APIs. `trailingSlash: true` is set, so all routes end with `/`.
- **OG image caching**: `og-generator.ts` checks whether the PNG already exists before generating. During development this can mean stale images; delete `public/assets/blog/og-images/` to force regeneration.
- **Mermaid diagrams**: `rehype-mermaid` (with `strategy: "inline-svg"`) renders ` ```mermaid ` fences to inline SVG at build time. It runs before `rehype-highlight` in the pipeline. The underlying `mermaid-isomorphic` package requires Playwright Chromium as a build-time renderer (not a test tool). `playwright`, `mermaid-isomorphic`, and `rehype-mermaid` are listed in `serverExternalPackages` in `next.config.mjs` to prevent Turbopack from bundling them. The CI workflow installs Chromium via `npx playwright install chromium --with-deps` before `npm run build`.
- **Bundler**: Next.js 16 uses **Turbopack** by default for both `next dev` and `next build`. There is no webpack config — SVG loading is handled via `turbopack.rules` in `next.config.mjs`. Do not add a `webpack()` callback; it will never be called.
- **SVGs as React components**: SVG files are imported directly as React components via `@svgr/webpack` (configured under `turbopack.rules`). The glob key `"*.svg"` matches by filename, so it covers SVGs in any subdirectory.
- **ESLint**: Uses ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-prettier/flat`. The lint script is `eslint .` — `next lint` no longer exists in Next.js 16. ESLint is pinned to `^9` because `typescript-eslint@8.x` (bundled in `eslint-config-next`) is incompatible with ESLint 10; revisit when `eslint-config-next` upgrades its bundled `typescript-eslint`.
- **Path alias**: `@/*` maps to `src/*`.
- **Styling**: Use Tailwind CSS utility classes for all styling — do not write custom CSS unless unavoidable. Global styles live in `src/app/globals.css`.
- **Dark mode**: Tailwind CSS v4 `dark:` variants driven by system `prefers-color-scheme`.
- **Typography**: `@tailwindcss/typography` (`prose` classes) is used for rendered Markdown content.
- **RSS feed**: `out/feed.xml` is generated at build time by `scripts/generate-feed.mjs` (uses the `feed` npm package). It writes directly to `out/` (not `public/`) so it is not tracked by git. It runs before `next-sitemap` in the `postbuild` script. Update the script when adding new content types.
- **Next.js `openGraph` merging**: A page-level `openGraph` export does NOT inherit `images`, `siteName`, or other sub-fields from the root layout. Only top-level `title`/`description` are auto-promoted. Always include all required OG fields explicitly in each page's `openGraph` object.
- **Twitter metadata**: Unlike `openGraph`, `twitter.title` and `twitter.description` are merged from the root layout into child pages. The layout sets defaults; override per-page where needed.
- **Heading hierarchy**: The site Header renders the site title as `<p>` (not `<h1>`) so each page owns its own `<h1>`. Every page must have exactly one `<h1>` describing its main content (post title, person name, section heading, etc.).
- **`next-sitemap` transform paths**: The `url` parameter in the `transform` function is a path (e.g. `/`, `/me/`), not a full URL. Do not compare against `config.siteUrl`.

### CSS architecture in `globals.css`

The production bundler is **Lightning CSS** (via `@tailwindcss/postcss`). Several rules apply:

1. **`@import` order**: All `@import` statements must come before any other at-rules (`@plugin`, `@utility`, `@layer` with rules, etc.). Out-of-order imports are silently dropped in production even if they appear to work in dev.

2. **Bare string imports for npm packages**: Always use `@import 'package/path'` — never `@import url('package/path')`. Lightning CSS treats `url()` as a remote URL fetch and silently skips npm package paths in production.

3. **`@tailwindcss/typography` vs highlight.js**: The highlight.js theme stylesheets (`paraiso-dark` / `paraiso-light`) live in `src/app/post/post.css`, which is imported only by `src/app/post/[slug]/page.tsx` so they don't bloat the global bundle. The typography plugin resets `pre code { background-color: transparent; color: inherit }`. To prevent this from overriding highlight.js token colours, the background overrides stay in `globals.css` using higher-specificity selectors (e.g. `.prose pre code.hljs { ... }` has specificity 0,4,0 vs typography's `:where()` selectors at 0,1,0). Never move those overrides to `post.css` — they must load on every page to prevent a flash of unstyled code on first navigation.

4. **TypeScript 6 CSS imports**: TypeScript 6 requires a type declaration for side-effect CSS imports. `declare module "*.css"` is in `src/interfaces/svgr.d.ts`.

### Dependabot

Configured in `.github/dependabot.yml` with daily checks for both `npm` and `github-actions` ecosystems. All npm updates are grouped into a single PR (`npm-deps` group). Major version bumps are ignored for `next`, `@next/third-parties`, `eslint-config-next`, `eslint`, `@types/node`, `@types/react`, and `@types/react-dom` — these must be upgraded manually.

When a Dependabot PR has a stale CI failure (failed against an older `main`), comment `@dependabot rebase` to trigger a fresh run rather than merging with a known failure.

If a transitive dependency has a vulnerability that cannot be fixed by a direct upgrade, use the `"overrides"` field in `package.json` to force a safe version across the entire dependency tree (see the existing `minimatch` override as an example).

When the conflicting package is also a direct dependency, a top-level override will be rejected by npm with `EOVERRIDE`. In that case, scope the override under the package that pins the old version (e.g. `"next": { "postcss": ">=8.5.10" }` instead of a top-level `"postcss"` key).

**`@emnapi` lock file gotcha**: Any time `package-lock.json` is edited manually and followed by `npm install`, the resolved entries for `@emnapi/core`, `@emnapi/runtime`, and `@emnapi/wasi-threads` are silently dropped. This causes `npm ci` to fail in GitHub Actions with "Missing: @emnapi/runtime from lock file". Always run `npm ci` locally after any manual lock file edit to catch this before committing. If entries are missing, restore them from the previous good commit.

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

Specify the language on every code fence — `rehype-highlight` uses the `language-*` class to tokenise the block. Use the appropriate identifier (e.g. ` ```typescript `, ` ```yaml `, ` ```bash `). For flow charts and diagrams, use ` ```mermaid ` — diagrams are rendered to inline SVG at build time via `rehype-mermaid`. For plain text where no real language or diagram syntax applies, use ` ```text `. An OG image is generated automatically on the next build.

If the post includes static images, place them in `public/assets/blog/<post-slug>/` and reference them in Markdown as `/assets/blog/<post-slug>/image.png`. The post slug (filename without `.md`) must match the asset subfolder name.
