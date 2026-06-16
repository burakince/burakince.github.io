#!/usr/bin/env python3
"""PostToolUse hook: auto-update lastModified in _posts/*.md front matter after Edit tool calls."""
import json
import sys
import re
from datetime import datetime, timezone

d = json.load(sys.stdin)
file_path = d.get("tool_input", {}).get("file_path", "")

if not (file_path.endswith(".md") and "/_posts/" in file_path):
    sys.exit(0)

try:
    with open(file_path, "r") as f:
        content = f.read()
except Exception:
    sys.exit(0)

now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.000Z")

if re.search(r"^lastModified:", content, re.MULTILINE):
    content = re.sub(r"^lastModified:.*$", f'lastModified: "{now}"', content, flags=re.MULTILINE)
else:
    # Insert after the date: line
    content = re.sub(r"^(date:.*)$", f'\\1\nlastModified: "{now}"', content, flags=re.MULTILINE, count=1)

with open(file_path, "w") as f:
    f.write(content)

sys.exit(0)
