# Blog

The blog posts are stored in `/_posts` as Markdown files with front matter support. Adding a new Markdown file in there will create a new blog post.

The new markdown file must have the following front matter fields:

```markdown
---
title: "Title"
excerpt: "Description"
date: "1970-01-01T00:00:01.000Z"
lastModified: "1970-01-01T00:00:01.000Z"
tags:
  - first-tag
  - second-tag
---
```

Set `lastModified` equal to `date` when creating a post. Update it to the current UTC time whenever you edit the content. Claude Code updates it automatically via a `PostToolUse` hook when editing posts through the `Edit` tool. `lastModified` drives `dateModified` in JSON-LD, `modifiedTime` in OpenGraph, and `lastmod` in the sitemap.

Always specify the language on code fences (e.g. ` ```typescript `, ` ```cypher ` for Neo4j queries) so syntax highlighting works correctly. The highlight.js CSS (`a11y-light` / `a11y-dark` themes) is imported in `src/app/globals.css` and applies site-wide.

## Adding new pages

When building page URLs (canonicals, `og:url`, JSON-LD `url` fields, `<a href>`), always use the `withTrailingSlash` helper from `src/lib/url.ts`:

```typescript
import { withTrailingSlash } from "@/lib/url";

// Good
withTrailingSlash(`${SITE_METADATA.siteUrl}/my-page`)  // → "https://www.burakince.com/my-page/"
withTrailingSlash(SITE_METADATA.siteUrl)               // → "https://www.burakince.com/"

// Not needed for asset/file paths
`${SITE_METADATA.siteUrl}/assets/image.png`
`${SITE_METADATA.siteUrl}/feed.xml`
```

The site uses `trailingSlash: true` in `next.config.mjs`. Missing slashes on page URLs cause redirects that slow down Google Search indexing.

## Development

This project requires the Node.js version defined in `.nvmrc`. Install [nvm](https://github.com/nvm-sh/nvm) and run:

```bash
nvm use
```

Starts the development server.

```bash
npm run dev
```

Runs the linter (ESLint flat config with Next.js core-web-vitals and prettier rules).

```bash
npm run lint
```

Builds the app for production. Some errors (TypeScript, CSS bundling, static export) only surface here.

```bash
npm run build
```

Runs the unit tests (vitest, no browser required).

```bash
npm test
```

Runs the E2E smoke tests against the built static site (`out/`). Requires `npm run build` first.

```bash
npm run test:e2e
```

Always confirm the full sequence passes before committing: `npm test && npm run build && npm run test:e2e`.

Runs the built app in production mode.

```bash
npx serve@latest out
```

## Profile JSON Endpoint

`/profile.json` is a static build-time endpoint consumed by the GitHub profile README auto-sync workflow in `burakince/burakince`. It exports:

- `name`, `jobTitle`, `company`, `companyUrl` — from `SITE_METADATA`
- `socialLinks` — github, linkedin, twitter, bluesky
- `recentPosts` — latest 5 posts (title, url, date, tags, excerpt)
- `skillCategories` — all categories from `SKILL_CATEGORIES_SORTED`

The endpoint is excluded from the sitemap and blocked by the existing `/*.json$` robots.txt rule. After each main-branch deploy, `pages.yml` sends a `repository_dispatch` (`event_type: blog-updated`) to `burakince/burakince` via the `PROFILE_DISPATCH_TOKEN` secret, triggering README regeneration automatically.

## Dependency Update

To get started, install the `npm-check-updates` package globally:

```bash
npm install -g npm-check-updates
```

Then, run `ncu` to display packages to upgrade.

To upgrade dependencies, you just need to run:

```bash
ncu --upgrade

# or
ncu -u
```

- Red = major
- Cyan = minor
- Green = patch

Interactive mode allows you to select specific packages to update. By default, all packages are selected.

Navigate down through each package and use space to deselect, and enter when you are ready to upgrade all of the selected packages.

```bash
ncu --interactive

# or
ncu -i
```

### `@emnapi` lock file gotcha

After any `npm install` run, the resolved entries for `@emnapi/core` and `@emnapi/runtime` may be silently dropped from `package-lock.json`. This causes `npm ci` to fail in CI. Always run `npm ci` locally after any dependency change to catch this before committing. See `.claude/rules/dependencies.md` for the restore script.

## Tools

- Social Share Preview Checker: https://socialsharepreview.com/
- Favicon Generator: https://realfavicongenerator.net/
- Open Graph Review and Generator: https://www.opengraph.xyz/
