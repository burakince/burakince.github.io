#!/usr/bin/env python3
"""PostToolUse hook: regenerate .vscode/tailwind.json from the Tailwind docs for the
   installed major version. Falls back to a minimal hardcoded set if the network is
   unavailable. Also runnable directly (no stdin) to force an immediate update."""
import html.parser
import json
import os
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DOCS_URL = "https://tailwindcss.com/docs/functions-and-directives"

# Minimal fallback used when the network fetch fails.
FALLBACK_DIRECTIVES = [
    "@import", "@theme", "@source", "@utility", "@variant",
    "@custom-variant", "@apply", "@reference", "@config", "@plugin",
]


class _DocsParser(html.parser.HTMLParser):
    """Extracts at-directive names, fragment IDs, and first-paragraph descriptions
    from the Tailwind CSS functions-and-directives docs page HTML."""

    def __init__(self):
        super().__init__()
        self._results = []          # [{name, fragment, description}]
        self._in_h3 = False
        self._h3_id = ""
        self._in_anchor = False
        self._current_name = ""
        self._want_desc = False     # True right after a directive h3 closes
        self._in_p = 0              # nesting depth inside <p>

    # --- helpers ---
    def _flush_p(self):
        text = " ".join(self._p_buf.split()).strip()
        if text and self._results:
            self._results[-1]["description"] = text
        self._p_buf = ""
        self._want_desc = False

    # --- SAX events ---
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h3":
            self._in_h3 = True
            self._h3_id = attrs.get("id", "")
            self._current_name = ""
        elif tag == "a" and self._in_h3:
            self._in_anchor = True
        elif tag == "p" and self._want_desc and self._in_p == 0:
            self._in_p = 1
            self._p_buf = ""
        elif tag == "p" and self._in_p:
            self._in_p += 1
    def handle_endtag(self, tag):
        if tag == "h3" and self._in_h3:
            self._in_h3 = False
            name = self._current_name.strip()
            if name.startswith("@") and " " not in name:
                self._results.append({"name": name, "fragment": self._h3_id, "description": ""})
                self._want_desc = True
        elif tag == "a" and self._in_anchor:
            self._in_anchor = False
        elif tag == "p" and self._in_p:
            self._in_p -= 1
            if self._in_p == 0:
                self._flush_p()
        elif tag == "h3" and self._want_desc:
            # Another h3 started before we got a <p> — give up on description
            self._want_desc = False

    def handle_data(self, data):
        if self._in_anchor and self._in_h3:
            self._current_name += data
        elif self._in_p:
            self._p_buf += data


def _fetch_directives(major: int) -> list[dict]:
    """Fetch directive metadata from the official Tailwind docs page."""
    req = urllib.request.Request(DOCS_URL, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=15)
    body = resp.read().decode("utf-8", errors="ignore")
    parser = _DocsParser()
    parser.feed(body)
    results = parser._results

    directives = []
    for entry in results:
        fragment = entry["fragment"] or (entry["name"].lstrip("@") + "-directive")
        directives.append({
            "name": entry["name"],
            "description": entry["description"] or f"See the Tailwind CSS documentation for {entry['name']}.",
            "references": [
                {
                    "name": "Tailwind Documentation",
                    "url": f"{DOCS_URL}#{fragment}",
                }
            ],
        })
    return directives


def _fallback_directives() -> list[dict]:
    return [
        {
            "name": name,
            "description": f"See the Tailwind CSS documentation for {name}.",
            "references": [{"name": "Tailwind Documentation", "url": DOCS_URL}],
        }
        for name in FALLBACK_DIRECTIVES
    ]


def detect_major_version() -> int | None:
    pkg = os.path.join(ROOT, "node_modules", "tailwindcss", "package.json")
    if not os.path.exists(pkg):
        return None
    with open(pkg) as f:
        ver = json.load(f).get("version", "")
    return int(ver.split(".")[0]) if ver else None


def update():
    major = detect_major_version()
    if major is None:
        return

    try:
        directives = _fetch_directives(major)
        if not directives:
            raise ValueError("No directives parsed from docs")
    except Exception:
        directives = _fallback_directives()

    out = os.path.join(ROOT, ".vscode", "tailwind.json")
    with open(out, "w") as f:
        json.dump({"version": 1.1, "atDirectives": directives}, f, indent=2)
        f.write("\n")


if __name__ == "__main__":
    # When called by the Claude Code hook, stdin carries the PostToolUse JSON event.
    # When called directly (empty stdin), skip the command check and update immediately.
    try:
        d = json.load(sys.stdin)
        cmd = d.get("tool_input", {}).get("command", "")
        npm_triggers = ("npm install", "npm ci", "npm update", "npm i ")
        if not any(t in cmd for t in npm_triggers):
            sys.exit(0)
    except (json.JSONDecodeError, ValueError):
        pass  # empty or non-JSON stdin — called directly, run unconditionally
    update()
    sys.exit(0)
