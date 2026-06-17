### Testing

Unit tests live in `src/lib/__tests__/`. E2E tests live in `e2e/`. Both run in CI: unit tests before the build, e2e after.

#### When to add or update tests

- **Changing or adding a `src/lib/` file** → add or update the corresponding test in `src/lib/__tests__/`.
- **Adding a new page or changing an existing page** (except `_posts/` blog posts) → add or update the relevant smoke test in `e2e/smoke.test.ts`.
- **Changing JSON-LD structured data on any page** → add or update the relevant test in `e2e/json-ld.test.ts`. That file covers: homepage `ItemList` (BlogPosting fields + OG image underscore filename), post page `BlogPosting` (required Article fields) and `BreadcrumbList` (container `name`, two `WebPage` items each with `@id` and `name`), about page `ProfilePage` (Person `mainEntity` with `name`, `jobTitle`, `sameAs`).

#### `markdownToHtml.ts` testing notes

- `rehypeImgSize` is intentionally not unit tested — it has filesystem/`sharp` side effects; treat it as an integration concern.
- `markdownToHtml()` itself is not unit tested — `rehype-mermaid` requires Playwright Chromium; it is covered by the e2e smoke test instead.
- The other rehype plugins (`rehypeMermaidA11y`, `rehypeHeadings`, `rehypeLazyImages`, `rehypePreTabindex`) are tested as isolated HAST tree transformers using plain JS objects. Call pattern: `(plugin as any)()(tree)`.
