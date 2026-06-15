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
