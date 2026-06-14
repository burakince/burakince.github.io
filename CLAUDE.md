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
  - `_components/` — Header, footer, container, post-preview, OG template, JSON-LD, social icons, date formatter; also:
    - `nav-links.tsx` — `"use client"` NavLinks with `usePathname`-based active-state highlighting; renders Latest Posts / Tags / About nav
    - `pagination.tsx` — Prev/Next pagination for multi-page listings; page 2 prev links to `/`, not `/page/1/`
    - `date-formatter.tsx` — renders a `<time>` element with **no text-color class**; it inherits color from its parent container. Do not apply a color class directly to `DateFormatter` — set it on the parent element instead.
    - `tag-chip.tsx` — Pill link to `/tag/[tag]/`; accepts `size="sm"|"md"`
  - `post/[slug]/page.tsx` — Dynamic post page; uses `generateStaticParams` to enumerate all posts
  - `post/_components/article-content.tsx` — `"use client"` component that renders post HTML via `dangerouslySetInnerHTML`, injects `.copy-btn` buttons into every `pre:has(code)` block after hydration, and handles clicks via `document`-level event delegation. Mermaid SVG blocks (`<svg>`) are not affected. Styles for `.copy-btn` live in `post/post.css`.
  - `page/[page]/page.tsx` — Paginated post listing (pages 2+); page 1 is served by `app/page.tsx`. `POSTS_PER_PAGE = 4`.
  - `tag/page.tsx` — All-tags index listing every unique tag with post counts
  - `tag/[tag]/page.tsx` — Tag-filtered post listing; 404s on unknown or empty tags
  - `me/page.tsx` — About/profile page (CV layout with print support)
  - `me/_components/anchor-heading.tsx` — `"use client"` `<h2>` with a hover copy-link button; hidden in print via `print:hidden`
  - `me/_components/print-icon-button.tsx` — `"use client"` print button that calls `window.print()`; hidden in print
- `src/lib/` — Core utilities
  - `api.ts` — Filesystem helpers (`getAllPosts`, `getPostBySlug`, `getAllTags`) that read `_posts/`; `getAllTags` returns a sorted deduplicated list of every tag found across all posts
  - `markdownToHtml.ts` — Unified/remark/rehype pipeline with `rehype-highlight` for syntax highlighting. Custom plugins: `rehypeMermaidA11y` (aria-label on Mermaid SVGs), `rehypeHeadings` (IDs for TOC), `rehypeImgSize` (injects `width`/`height` on local `<img>` elements at build time via `sharp`), `rehypeLazyImages` (adds `loading="lazy"`).
  - `og-generator.ts` — Generates OG images as PNGs using satori + resvg-js; images are written to `public/assets/blog/og-images/` and skipped if already present
  - `site-metadata.ts` — Single source of truth for site-wide config (author, URLs, analytics ID)
  - `schema.ts` — Shared `orgJsonLd` (`Organization` JSON-LD object) used across all three page files
  - `skills.ts` — Single source of truth for skill categories and core concepts; exports `SKILL_CATEGORIES_SORTED` (each category's items sorted alphabetically) and `ALL_SKILLS_SORTED` (deduplicated union of all items and core concepts, sorted with `localeCompare("en")`); drives both the visible Skills section and the `knowsAbout` JSON-LD on `/me/`. Always consume the `_SORTED` exports — do not sort at call sites.
  - `reading-time.ts` — `readingTime(content)` returns estimated read time in minutes (words / 200, minimum 1)
  - `truncate.ts` — `smartTruncate(text, maxChars=130)` trims at sentence or word boundaries and appends an ellipsis; used for post excerpt display
  - `experience.ts` — `EXPERIENCE_GROUPS` typed array of `ExperienceGroup` (heading + `ExperienceEntry[]`); drives the work history on `/me/`
  - `url.ts` — `withTrailingSlash(url)` strips any existing trailing slashes and appends one; use for every own-site page URL construction (canonicals, OG `url`, JSON-LD `url`, href links). Do not apply to asset paths, file routes (`/feed.xml`, `/sitemap.xml`), or external URLs.
- `src/interfaces/` — TypeScript types (`Post`, `Params`); also holds module declarations (`svgr.d.ts`)
- `fonts/` — Inter font files required by `og-generator.ts` at build time

### Important behaviors

- **Static export**: No server components that rely on runtime APIs. `trailingSlash: true` is set, so all routes end with `/`. Always construct own-site page URLs with `withTrailingSlash()` from `src/lib/url.ts` — never hand-write the trailing slash, as it is easy to omit and causes Google Search Console redirect warnings.
- **Pagination**: The home page (`/`) always shows the first page of posts. Pages 2+ are at `/page/[n]/` and rendered by `src/app/page/[page]/page.tsx`. `POSTS_PER_PAGE = 4` is defined there. The `Pagination` component hard-codes the prev link on page 2 to `/` (not `/page/1/`), so do not create a `/page/1/` route.
- **Tag routing**: Tags in post front matter drive `/tag/` and `/tag/[tag]/` routes. `getAllTags()` in `api.ts` aggregates tags across all posts. Add new tags by including them in a post's `tags:` array; no other registration is needed.
- **OG image caching**: `og-generator.ts` checks whether the PNG already exists before generating. During development this can mean stale images; delete `public/assets/blog/og-images/` to force regeneration.
- **Mermaid diagrams**: `rehype-mermaid` (with `strategy: "inline-svg"`) renders ` ```mermaid ` fences to inline SVG at build time. It runs before `rehype-highlight` in the pipeline. The underlying `mermaid-isomorphic` package requires Playwright Chromium as a build-time renderer (not a test tool). `playwright`, `mermaid-isomorphic`, and `rehype-mermaid` are listed in `serverExternalPackages` in `next.config.mjs` to prevent Turbopack from bundling them. The CI workflow installs Chromium via `npx playwright install chromium --with-deps` before `npm run build`. The `rehypeMermaidA11y` plugin (defined in `src/lib/markdownToHtml.ts`, runs immediately after `rehypeMermaid`) injects `aria-label` on each SVG using the nearest preceding heading text, satisfying **WCAG 1.1.1 A** — SVGs with `role="graphics-document"` require an accessible name.
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
- **List element semantics**: `<dl>` requires `<dt>`+`<dd>` pairs — a `<dl>` with bare `<dd>` children is invalid HTML. Use `<ul>`/`<li>` for plain item lists (tag index, post lists, etc.).
- **Image dimensions**: The `rehypeImgSize` plugin automatically injects `width`/`height` on all local `<img>` tags in Markdown posts at build time — no manual attributes needed in post content. For Next.js `<Image>` components in source files, `width` and `height` props must match the actual file dimensions (use `sharp` or `file` to check); declaring wrong dimensions causes CLS and validator warnings.
- **Minimum font size**: Body/content text must be at least 12pt (16px = `text-base`). `text-sm` = 14px = 10.5pt — do not use it for paragraph or description content. It is acceptable only for secondary metadata (dates, reading-time, tag counts) that is clearly supplementary. `text-xs` = 12px = 9pt is at the hard minimum and should not be used for content.
- **`next-sitemap` transform paths**: The `url` parameter in the `transform` function is a path (e.g. `/`, `/me/`), not a full URL. Do not compare against `config.siteUrl`.

### Accessibility

- **WCAG 1.1.1 A — Non-text content**: Inline SVGs with `role="graphics-document"` (emitted by Mermaid) need an accessible name via `aria-label` or a `<title>` child. The `rehypeMermaidA11y` plugin handles this automatically for all Mermaid diagrams.

- **WCAG 1.4.3 AA — Contrast minimum**: Normal-weight text under 18pt requires a 4.5:1 ratio against its background. On the site's `bg-slate-100` body background, `text-slate-400` (2.4:1) and `text-slate-500` (4.35:1) both fail AA. **`text-slate-600` is the minimum safe Tailwind class for secondary/muted text on `bg-slate-100`.** `text-slate-500` only passes AA on explicit `bg-white` surfaces (~5.8:1) but still fails AAA there. Dark-mode equivalents (`dark:text-slate-400`) pass on `dark:bg-slate-800` (~4.8:1) and need no change.

- **WCAG F24 — Incomplete color pair**: If CSS sets `background-color` on `<body>`, it must also set `color` explicitly (browser defaults don't count). The `<body>` in `src/app/layout.tsx` carries `text-gray-900 dark:text-gray-100` alongside `bg-slate-100 dark:bg-slate-800` for this reason.

- **WCAG F22 / 3.2.5 AAA — New-window warning**: Every `target="_blank"` link must inform screen-reader users it opens in a new tab. Pattern: for icon-only links, update the `sr-only` span text directly (e.g. `"github (opens in a new tab)"`). For links with visible text, append `<span className="sr-only"> (opens in a new tab)</span>` as the last child inside the `<a>`. Affected locations in this codebase: footer social icons, `me/page.tsx` platform cards and cert list, post share buttons.

- **WCAG 1.4.6 AAA — Enhanced contrast (7:1)**: AAA requires 7:1 vs AA's 4.5:1 for normal-weight text under 18pt. Safe Tailwind classes confirmed for this site's palette:
  - `text-slate-300` → ~9.7:1 on dark gradient `from-slate-800 to-slate-900` (post header date/reading-time)
  - `text-slate-300` → 9.1:1 on `bg-slate-800` (dark header subtitle)
  - `text-violet-200` → 9.9:1 on `bg-slate-800` (active nav link on dark header)
  - `text-slate-600` → 7.84:1 on `bg-white` (muted text on white card backgrounds; also the AAA minimum on white)
  - `text-slate-700` → 8.85:1 on `bg-slate-100` (secondary text on body background; `text-slate-600` = 6.92:1 on slate-100, which fails AAA by 0.08)
  - `text-violet-700` → 7.14:1 on `bg-white` (brand-coloured links on white)
  - `text-violet-800` → 8.24:1 on `bg-slate-100` (TOC links on body background)
  - `text-violet-800` → 7.6:1 on `bg-violet-100` (TagChip text on violet pill background)

- **HAST property-name gotcha**: When writing rehype plugins, HAST property names do not always follow simple camelCase. Look up the correct name before using it — a wrong name silently does nothing:
  ```bash
  node -e "const pi = require('property-information'); console.log(pi.find(pi.svg, 'aria-roledescription'));"
  # → { property: 'ariaRoleDescription', ... }   ← capital D, not 'ariaRoledescription'
  ```

### CSS architecture in `globals.css`

The production bundler is **Lightning CSS** (via `@tailwindcss/postcss`). Several rules apply:

1. **`@import` order**: All `@import` statements must come before any other at-rules (`@plugin`, `@utility`, `@layer` with rules, etc.). Out-of-order imports are silently dropped in production even if they appear to work in dev.

2. **Bare string imports for npm packages**: Always use `@import 'package/path'` — never `@import url('package/path')`. Lightning CSS treats `url()` as a remote URL fetch and silently skips npm package paths in production.

3. **`@tailwindcss/typography` vs highlight.js**: The highlight.js theme stylesheets (`a11y-dark` / `a11y-light`) are imported at the top of `src/app/globals.css` — there is no separate `post.css`. The themes were chosen specifically because all their token colors pass WCAG AA (4.5:1) against their own backgrounds (`#2b2b2b` / `#fefefe`). The typography plugin resets `pre code { background-color: transparent; color: inherit }`. To prevent this from overriding highlight.js token colours, the background overrides stay in `globals.css` using higher-specificity selectors (e.g. `.prose pre code.hljs { ... }` has specificity 0,4,0 vs typography's `:where()` selectors at 0,1,0) with values `#2b2b2b` (dark) and `#fefefe` (light). Never move those overrides elsewhere — they must load on every page to prevent a flash of unstyled code on first navigation.

4. **TypeScript 6 CSS imports**: TypeScript 6 requires a type declaration for side-effect CSS imports. `declare module "*.css"` is in `src/interfaces/svgr.d.ts`.

### Dependabot

Configured in `.github/dependabot.yml` with daily checks for both `npm` and `github-actions` ecosystems. All npm updates are grouped into a single PR (`npm-deps` group). Major version bumps are ignored for `next`, `@next/third-parties`, `eslint-config-next`, `eslint`, `@types/node`, `@types/react`, and `@types/react-dom` — these must be upgraded manually.

When a Dependabot PR has a stale CI failure (failed against an older `main`), comment `@dependabot rebase` to trigger a fresh run rather than merging with a known failure.

If a transitive dependency has a vulnerability that cannot be fixed by a direct upgrade, use the `"overrides"` field in `package.json` to force a safe version across the entire dependency tree (see the existing `minimatch` override as an example).

When the conflicting package is also a direct dependency, a top-level override will be rejected by npm with `EOVERRIDE`. In that case, scope the override under the package that pins the old version (e.g. `"next": { "postcss": ">=8.5.10" }` instead of a top-level `"postcss"` key).

**`@emnapi` lock file gotcha**: Any time `package-lock.json` is edited manually or `npm install` is run after a rebase that merges package changes, the resolved entries for `@emnapi/core`, `@emnapi/runtime`, and `@emnapi/wasi-threads` are silently dropped or restructured. This causes `npm ci` to fail in GitHub Actions. Always run `npm ci` locally after any lock file change to catch this before committing.

If entries are missing after `npm install`:
1. Restore `node_modules/@emnapi/core` and `node_modules/@emnapi/runtime` from the previous good commit (they carry version, resolved, integrity, and dependency fields).
2. If the top-level `node_modules/@emnapi/wasi-threads` was upgraded to a newer version (e.g. `1.2.2`) but `@emnapi/core` still pins the older version (e.g. `1.2.1`) in its `dependencies`, add a nested entry `node_modules/@emnapi/core/node_modules/@emnapi/wasi-threads` at the older version so `npm ci` can satisfy that pinned dependency.
3. Run `npm ci` to confirm the lock file is valid before committing.

### Adding a blog post

Create a Markdown file in `_posts/` named with kebab-case and a `.md` extension (e.g. `my-post-title.md`). The filename becomes the URL slug. Required front matter:

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
tags:
  - tag-one
  - tag-two
---
```

Specify the language on every code fence — `rehype-highlight` uses the `language-*` class to tokenise the block. Use the appropriate identifier (e.g. ` ```typescript `, ` ```yaml `, ` ```bash `). For flow charts and diagrams, use ` ```mermaid ` — diagrams are rendered to inline SVG at build time via `rehype-mermaid`. For plain text where no real language or diagram syntax applies, use ` ```text `. An OG image is generated automatically on the next build.

If the post includes static images, place them in `public/assets/blog/<post-slug>/` and reference them in Markdown as `/assets/blog/<post-slug>/image.png`. The post slug (filename without `.md`) must match the asset subfolder name.
