import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import { getAllPosts, getAllTags, getPostBySlug, getPostSlugs } from "@/lib/api";

// ─── Mock post content ────────────────────────────────────────────────────────

const MOCK_POST_A = `---
title: "Alpha Post"
excerpt: "Alpha excerpt"
date: "2024-03-15T00:00:00.000Z"
lastModified: "2024-03-15T00:00:00.000Z"
tags:
  - typescript
  - nextjs
---
Alpha post content here.`;

const MOCK_POST_B = `---
title: "Beta Post"
excerpt: "Beta excerpt"
date: "2024-01-10T00:00:00.000Z"
lastModified: "2024-01-10T00:00:00.000Z"
tags:
  - typescript
  - kubernetes
---
Beta post content here.`;

// ─── Filesystem mocks ─────────────────────────────────────────────────────────

beforeEach(() => {
  vi.spyOn(fs, "readdirSync").mockReturnValue(
    ["alpha-post.md", "beta-post.md"] as any
  );
  vi.spyOn(fs, "readFileSync").mockImplementation((filePath: unknown) => {
    const p = String(filePath);
    if (p.endsWith("alpha-post.md")) return MOCK_POST_A;
    if (p.endsWith("beta-post.md")) return MOCK_POST_B;
    throw new Error(`Unexpected path: ${p}`);
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("getPostSlugs", () => {
  it("returns filenames from the posts directory", () => {
    expect(getPostSlugs()).toEqual(["alpha-post.md", "beta-post.md"]);
  });
});

describe("getPostBySlug", () => {
  it("strips .md extension and sets slug", () => {
    expect(getPostBySlug("alpha-post.md").slug).toBe("alpha-post");
  });

  it("works when slug has no .md extension", () => {
    expect(getPostBySlug("alpha-post").slug).toBe("alpha-post");
  });

  it("parses front matter string fields", () => {
    const post = getPostBySlug("alpha-post");
    expect(post.title).toBe("Alpha Post");
    expect(post.excerpt).toBe("Alpha excerpt");
    expect(post.date).toBe("2024-03-15T00:00:00.000Z");
    expect(post.lastModified).toBe("2024-03-15T00:00:00.000Z");
  });

  it("parses tags as an array", () => {
    expect(getPostBySlug("alpha-post").tags).toEqual(["typescript", "nextjs"]);
  });

  it("includes the markdown content body", () => {
    expect(getPostBySlug("alpha-post").content).toContain("Alpha post content here.");
  });
});

describe("getAllPosts", () => {
  it("returns all posts", () => {
    expect(getAllPosts()).toHaveLength(2);
  });

  it("sorts posts by date descending (newest first)", () => {
    const [first, second] = getAllPosts();
    expect(first.date).toBe("2024-03-15T00:00:00.000Z");
    expect(second.date).toBe("2024-01-10T00:00:00.000Z");
  });

  it("each post has required fields", () => {
    for (const post of getAllPosts()) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.date).toBeTruthy();
      expect(post.content).toBeTruthy();
    }
  });
});

describe("getAllTags", () => {
  it("deduplicates tags that appear in multiple posts", () => {
    // "typescript" is in both posts — must appear exactly once
    expect(getAllTags().filter((t) => t === "typescript")).toHaveLength(1);
  });

  it("includes all unique tags across all posts", () => {
    const tags = getAllTags();
    expect(tags).toContain("typescript");
    expect(tags).toContain("nextjs");
    expect(tags).toContain("kubernetes");
  });

  it("returns tags sorted alphabetically", () => {
    const tags = getAllTags();
    for (let i = 0; i < tags.length - 1; i++) {
      expect(
        tags[i].localeCompare(tags[i + 1], "en"),
        `"${tags[i]}" should sort before "${tags[i + 1]}"`
      ).toBeLessThanOrEqual(0);
    }
  });
});
