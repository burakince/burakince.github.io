#!/usr/bin/env python3
"""PostToolUse hook: block npm install if @emnapi entries are missing from package-lock.json."""
import json
import sys
import os

d = json.load(sys.stdin)
cmd = d.get("tool_input", {}).get("command", "")

if "npm install" not in cmd:
    sys.exit(0)

lock = "package-lock.json"
if not os.path.exists(lock):
    sys.exit(0)

packages = json.load(open(lock)).get("packages", {})
missing = [k for k in ["node_modules/@emnapi/core", "node_modules/@emnapi/runtime"] if k not in packages]

if not missing:
    sys.exit(0)

print(json.dumps({
    "decision": "block",
    "reason": "@emnapi lock file gotcha: " + ", ".join(missing) + " dropped from package-lock.json. Restore from the previous good git commit before committing.",
}))
sys.exit(2)
