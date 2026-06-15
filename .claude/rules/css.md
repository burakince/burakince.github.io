### CSS architecture in `globals.css`

The production bundler is **Lightning CSS** (via `@tailwindcss/postcss`). Several rules apply:

1. **`@import` order**: All `@import` statements must come before any other at-rules (`@plugin`, `@utility`, `@layer` with rules, etc.). Out-of-order imports are silently dropped in production even if they appear to work in dev.

2. **Bare string imports for npm packages**: Always use `@import 'package/path'` — never `@import url('package/path')`. Lightning CSS treats `url()` as a remote URL fetch and silently skips npm package paths in production.

3. **`@tailwindcss/typography` vs highlight.js**: The highlight.js theme stylesheets (`a11y-dark` / `a11y-light`) are imported at the top of `src/app/globals.css` — there is no separate `post.css`. The themes were chosen specifically because all their token colors pass WCAG AA (4.5:1) against their own backgrounds (`#2b2b2b` / `#fefefe`). The typography plugin resets `pre code { background-color: transparent; color: inherit }`. To prevent this from overriding highlight.js token colours, the background overrides stay in `globals.css` using higher-specificity selectors (e.g. `.prose pre code.hljs { ... }` has specificity 0,4,0 vs typography's `:where()` selectors at 0,1,0) with values `#2b2b2b` (dark) and `#fefefe` (light). Never move those overrides elsewhere — they must load on every page to prevent a flash of unstyled code on first navigation.

4. **TypeScript 6 CSS imports**: TypeScript 6 requires a type declaration for side-effect CSS imports. `declare module "*.css"` is in `src/interfaces/svgr.d.ts`.
