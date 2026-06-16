### Dependabot

Configured in `.github/dependabot.yml` with daily checks for both `npm` and `github-actions` ecosystems. All npm updates are grouped into a single PR (`npm-deps` group). Major version bumps are ignored for `next`, `@next/third-parties`, `eslint-config-next`, `eslint`, `@types/node`, `@types/react`, and `@types/react-dom` — these must be upgraded manually.

When a Dependabot PR has a stale CI failure (failed against an older `main`), comment `@dependabot rebase` to trigger a fresh run rather than merging with a known failure.

If a transitive dependency has a vulnerability that cannot be fixed by a direct upgrade, use the `"overrides"` field in `package.json` to force a safe version across the entire dependency tree (see the existing `minimatch` override as an example).

When the conflicting package is also a direct dependency, a top-level override will be rejected by npm with `EOVERRIDE`. In that case, scope the override under the package that pins the old version (e.g. `"next": { "postcss": ">=8.5.10" }` instead of a top-level `"postcss"` key).

**Override caveats:**
- Always cap overrides to avoid pulling in a breaking major version. Use `">=X.Y.Z <(X+1).0.0"` rather than `">=X.Y.Z"` — an uncapped override can silently install the next major and break the build (e.g. `"@babel/core": ">=7.29.6"` pulled in Babel 8 which has incompatible API changes).
- A top-level override forces the pinned version on *all* dependents, including ones that require the old API. If different packages in the tree need different major versions of the same package, scope the override under the specific packages that can handle the upgrade. Example: if only `@eslint/eslintrc` and `cosmiconfig` need js-yaml 4.x while `gray-matter` requires js-yaml 3.x, scope the override instead of setting it globally.
- When a vulnerable transitive dep cannot be overridden safely (incompatible API change across majors, no scoping possible), prefer **replacing the direct dep** that pulls it in rather than fighting the override. Example: `gray-matter` was replaced by `src/lib/front-matter.ts` (js-yaml 4.x directly) to resolve the js-yaml 3.x DoS vulnerability.

**`@emnapi` lock file gotcha**: Any time `package-lock.json` is edited manually or `npm install` is run after a rebase that merges package changes, the resolved entries for `@emnapi/core`, `@emnapi/runtime`, and `@emnapi/wasi-threads` are silently dropped or restructured. This causes `npm ci` to fail in GitHub Actions. Always run `npm ci` locally after any lock file change to catch this before committing.

If entries are missing after `npm install`, restore them by running this Python script via Bash (bypasses the `Edit` hook):

```python
import json

with open("package-lock.json") as f:
    lock = json.load(f)

pkgs = lock["packages"]

restore = {
    "node_modules/@emnapi/core": {
        "version": "1.10.0",
        "resolved": "https://registry.npmjs.org/@emnapi/core/-/core-1.10.0.tgz",
        "integrity": "sha512-yq6OkJ4p82CAfPl0u9mQebQHKPJkY7WrIuk205cTYnYe+k2Z8YBh11FrbRG/H6ihirqcacOgl2BIO8oyMQLeXw==",
        "dev": True, "license": "MIT", "optional": True, "peer": True,
        "dependencies": {"@emnapi/wasi-threads": "1.2.1", "tslib": "^2.4.0"}
    },
    "node_modules/@emnapi/core/node_modules/@emnapi/wasi-threads": {
        "version": "1.2.1",
        "resolved": "https://registry.npmjs.org/@emnapi/wasi-threads/-/wasi-threads-1.2.1.tgz",
        "integrity": "sha512-uTII7OYF+/Mes/MrcIOYp5yOtSMLBWSIoLPpcgwipoiKbli6k322tcoFsxoIIxPDqW01SQGAgko4EzZi2BNv2w==",
        "dev": True, "license": "MIT", "optional": True, "peer": True,
        "dependencies": {"tslib": "^2.4.0"}
    },
    "node_modules/@emnapi/runtime": {
        "version": "1.10.0",
        "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.10.0.tgz",
        "integrity": "sha512-ewvYlk86xUoGI0zQRNq/mC+16R1QeDlKQy21Ki3oSYXNgLb45GV1P6A0M+/s6nyCuNDqe5VpaY84BzXGwVbwFA==",
        "license": "MIT", "optional": True,
        "dependencies": {"tslib": "^2.4.0"}
    },
}

for key, entry in restore.items():
    if key not in pkgs:
        pkgs[key] = entry

with open("package-lock.json", "w") as f:
    json.dump(lock, f, indent=2)
    f.write("\n")
```

Then run `npm ci` to confirm the lock file is valid before committing. If `@emnapi` packages themselves are upgraded (version number changes), update the version, resolved URL, and integrity values in the script above from the new `node_modules/@emnapi/*/package.json` files.
