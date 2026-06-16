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
  - `post/[slug]/page.tsx` — Dynamic post page; uses `generateStaticParams` to enumerate all posts. Emits two `<JsonLd>` blocks: `BlogPosting` (with `mainEntityOfPage` set to the canonical post URL, `wordCount` computed as `post.content.trim().split(/\s+/).length`, and post tags as JSON-LD `keywords`) and `BreadcrumbList` (Home → post title breadcrumbs, enables Google's breadcrumb search snippets). The Next.js `Metadata` export does **not** include a `keywords` field.
  - `post/_components/article-content.tsx` — `"use client"` component that renders post HTML via `dangerouslySetInnerHTML`, injects `.copy-btn` buttons into every `pre:has(code)` block after hydration, and handles clicks via `document`-level event delegation. Mermaid SVG blocks (`<svg>`) are not affected. Styles for `.copy-btn` live in `post/post.css`.
  - `page/[page]/page.tsx` — Paginated post listing (pages 2+); page 1 is served by `app/page.tsx`. `POSTS_PER_PAGE = 4`.
  - `tag/page.tsx` — All-tags index listing every unique tag with post counts; exports a `description` built from total tag and post counts for SEO
  - `tag/[tag]/page.tsx` — Tag-filtered post listing; 404s on unknown or empty tags; `generateMetadata` returns a per-tag `description` (e.g. `"3 posts tagged #neo4j on Burak Ince's engineering blog."`) for SEO
  - `me/page.tsx` — About/profile page (CV layout with print support); page `title` and `description` reference `PROFESSIONAL_YEARS` (computed at module level from `PROFESSIONAL_START`) so they stay accurate without manual updates
  - `me/_components/anchor-heading.tsx` — `"use client"` `<h2>` with a hover copy-link button; hidden in print via `print:hidden`
  - `me/_components/print-icon-button.tsx` — `"use client"` print button that calls `window.print()`; hidden in print
- `src/lib/` — Core utilities
  - `api.ts` — Filesystem helpers (`getAllPosts`, `getPostBySlug`, `getAllTags`) that read `_posts/`; uses `front-matter.ts` (not gray-matter) to parse YAML; `getAllTags` returns a sorted deduplicated list of every tag found across all posts
  - `front-matter.ts` — Thin front-matter parser using js-yaml 4.x directly (`yaml.load`). Provides `matter(content) → { data, content }`, the same API as the removed `gray-matter` package. Do not re-introduce `gray-matter` — it pins js-yaml 3.x which has a known DoS vulnerability (GHSA-h67p-54hq-rp68) and no 4.x-compatible release.
  - `markdownToHtml.ts` — Unified/remark/rehype pipeline with `rehype-highlight` for syntax highlighting. `rehypeHighlight` is configured with `{ languages: { ...common, cypher } }` — spreading lowlight's 37 built-in common languages and adding `highlightjs-cypher` for Neo4j Cypher query syntax. Custom plugins: `rehypeMermaidA11y` (aria-label on Mermaid SVGs), `rehypeHeadings` (IDs for TOC), `rehypeImgSize` (injects `width`/`height` on local `<img>` elements at build time via `sharp`), `rehypeLazyImages` (adds `loading="lazy"`).
  - `og-generator.ts` — Generates OG images as PNGs using satori + resvg-js; images are written to `public/assets/blog/og-images/` and skipped if already present
  - `site-metadata.ts` — Single source of truth for site-wide config (author, URLs, analytics ID). A `COMPANY` constant at the top of the file holds `name`, `jobTitle`, `url`, and `logo`; `worksFor` and `description` reference it so all company fields update together when the employer changes.
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
- **SVG icons must include intrinsic dimensions**: Files in `src/app/_components/social-icons/` use `width="24" height="24" viewBox="0 0 24 24"`. Without explicit dimensions, `viewBox`-only SVGs expand to fill the page when CSS fails (Wayback Machine, reader mode). Tailwind `size-*` classes override these when CSS loads. Any new icon added to `social-icons/` must include `width="24" height="24"`.
- **SVG hover colour — use `group`/`group-hover`**: A `hover:text-*` on a parent `<a>` does NOT reach an SVG that has its own explicit `text-*` class. Use `group` on the `<a>` and `group-hover:text-*` on the SVG component instead.
- **No `primary-*` colour token**: This Tailwind v4 config defines no `primary` scale. Classes like `text-primary-500`, `bg-primary-400`, `hover:text-primary-500` silently do nothing. Use the `violet-*` scale for brand colour.
- **ESLint**: Uses ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next/core-web-vitals` and `eslint-config-prettier/flat`. The lint script is `eslint .` — `next lint` no longer exists in Next.js 16. ESLint is pinned to `^9` because `typescript-eslint@8.x` (bundled in `eslint-config-next`) is incompatible with ESLint 10; revisit when `eslint-config-next` upgrades its bundled `typescript-eslint`.
- **Path alias**: `@/*` maps to `src/*`.
- **Styling**: Use Tailwind CSS utility classes for all styling — do not write custom CSS unless unavoidable. Global styles live in `src/app/globals.css`.
- **Dark mode**: Tailwind CSS v4 `dark:` variants driven by system `prefers-color-scheme`.
- **Typography**: `@tailwindcss/typography` (`prose` classes) is used for rendered Markdown content.
- **RSS feed**: `out/feed.xml` is generated at build time by `scripts/generate-feed.mjs` (uses the `feed` npm package). It writes directly to `out/` (not `public/`) so it is not tracked by git. It runs before `next-sitemap` in the `postbuild` script. Update the script when adding new content types.
- **Next.js `openGraph` merging**: A page-level `openGraph` export does NOT inherit `images`, `siteName`, or other sub-fields from the root layout. Only top-level `title`/`description` are auto-promoted. Always include all required OG fields explicitly in each page's `openGraph` object.
- **Twitter metadata**: Unlike `openGraph`, `twitter.title` and `twitter.description` are merged from the root layout into child pages. The layout sets defaults; override per-page where needed.
- **No `<meta name="keywords">` tag**: Google has ignored this meta tag since September 2009; Bing also dropped it. No page in this site exports `keywords` in its Next.js `Metadata` object. Do not add it back. Topic SEO is handled by the `/tag/[tag]/` route pages, the `keywords` field inside JSON-LD structured data objects, and content quality.
- **Heading hierarchy**: The site Header renders the site title as `<span class="block">` (not `<h1>`) so each page owns its own `<h1>`. Every page must have exactly one `<h1>` describing its main content (post title, person name, section heading, etc.). Do not change the header spans to `<p>` (triggers "paragraph styled as heading" a11y warning) or to a heading element (wrong heading order — heading before page `<h1>`).
- **List element semantics**: `<dl>` requires `<dt>`+`<dd>` pairs — a `<dl>` with bare `<dd>` children is invalid HTML. Use `<ul>`/`<li>` for plain item lists (tag index, post lists, etc.).
- **Image dimensions**: The `rehypeImgSize` plugin automatically injects `width`/`height` on all local `<img>` tags in Markdown posts at build time — no manual attributes needed in post content. For Next.js `<Image>` components in source files, `width` and `height` props must match the actual file dimensions (use `sharp` or `file` to check); declaring wrong dimensions causes CLS and validator warnings.
- **Minimum font size**: Body/content text must be at least 12pt (16px = `text-base`). `text-sm` = 14px = 10.5pt — do not use it for paragraph or description content. It is acceptable only for secondary metadata (dates, reading-time, tag counts) that is clearly supplementary. `text-xs` = 12px = 9pt is at the hard minimum and should not be used for content.
- **`lastModified` front matter field**: Every post requires a `lastModified` ISO timestamp. It feeds `dateModified` in the `BlogPosting` JSON-LD, `modifiedTime` in OpenGraph, and `lastmod` in the sitemap. A Claude Code `PostToolUse` hook (`.claude/scripts/update-post-modified.py`) auto-stamps it to the current UTC time whenever the `Edit` tool touches a `_posts/*.md` file. For edits made outside Claude Code, update `lastModified` manually. When creating a new post, set `lastModified` equal to `date`.
- **`next-sitemap` transform paths**: The `url` parameter in the `transform` function is a path (e.g. `/`, `/me/`), not a full URL. Do not compare against `config.siteUrl`. Post pages use the post's `lastModified` as `lastmod`. Home (`/`), paginated listing (`/page/[n]/`), and tag pages (`/tag/`, `/tag/[tag]/`) derive `lastmod` from the most recently modified post; tag pages use the latest `lastModified` among posts with that specific tag. Other pages (e.g. `/me/`) fall back to the build time.
- **llms.txt format compliance**: The llms.txt spec (enforced by minoka.de validator) requires that under any `##` section, every non-blank line must be either a `-` list item or a `###` sub-heading, and every `-` list item must contain a Markdown link `[text](url)`. Content before the first `##` can be any Markdown. Three routes produce llms.txt files — `src/app/llms.txt/route.ts`, `src/app/me/llms.txt/route.ts`, and `src/app/post/[slug]/llms.txt/route.ts`. Per-post llms.txt bumps all blog post heading levels by one (`##` → `###`) via `.replace(/^(#{2,})/gm, '#$1')` so no `##` sections appear in the output. Items without their own URL (experience entries, skill categories on `/me/llms.txt`) link to `withTrailingSlash(\`${siteUrl}/me\`)` as a fallback.

### Adding a blog post

Create a Markdown file in `_posts/` named with kebab-case and a `.md` extension (e.g. `my-post-title.md`). The filename becomes the URL slug. Required front matter:

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
lastModified: "1970-01-01T00:00:01.000Z"
tags:
  - tag-one
  - tag-two
---
```

Specify the language on every code fence — `rehype-highlight` uses the `language-*` class to tokenise the block. Use the appropriate identifier (e.g. ` ```typescript `, ` ```yaml `, ` ```bash `, ` ```cypher ` for Neo4j Cypher queries). For flow charts and diagrams, use ` ```mermaid ` — diagrams are rendered to inline SVG at build time via `rehype-mermaid`. For plain text where no real language or diagram syntax applies, use ` ```text `. An OG image is generated automatically on the next build.

If the post includes static images, place them in `public/assets/blog/<post-slug>/` and reference them in Markdown as `/assets/blog/<post-slug>/image.png`. The post slug (filename without `.md`) must match the asset subfolder name.
