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
