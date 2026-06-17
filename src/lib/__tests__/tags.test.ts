import { describe, it, expect } from "vitest";
import { countPostsByTag, sortTagsByPostCount } from "@/lib/tags";
import type { Post } from "@/interfaces/post";

function post(tags: string[]): Post {
  return { slug: "x", title: "X", date: "", lastModified: "", excerpt: "", content: "", tags };
}

describe("countPostsByTag", () => {
  it("counts posts for each tag correctly", () => {
    const posts = [post(["a", "b"]), post(["b", "c"]), post(["a"])];
    expect(countPostsByTag(posts, ["a", "b", "c"])).toEqual({ a: 2, b: 2, c: 1 });
  });

  it("returns 0 for tags with no matching posts", () => {
    expect(countPostsByTag([post(["a"])], ["a", "b"]).b).toBe(0);
  });

  it("handles posts with no tags", () => {
    expect(countPostsByTag([post([]), post(["a"])], ["a"])).toEqual({ a: 1 });
  });

  it("returns an empty object when tags list is empty", () => {
    expect(countPostsByTag([post(["a"])], [])).toEqual({});
  });
});

describe("sortTagsByPostCount", () => {
  it("sorts tags by post count descending", () => {
    const sorted = sortTagsByPostCount(["a", "b", "c"], { a: 1, b: 3, c: 2 });
    expect(sorted).toEqual(["b", "c", "a"]);
  });

  it("does not mutate the original tags array", () => {
    const original = ["a", "b", "c"];
    sortTagsByPostCount(original, { a: 1, b: 2, c: 3 });
    expect(original).toEqual(["a", "b", "c"]);
  });

  it("preserves original relative order for tags with equal counts", () => {
    const sorted = sortTagsByPostCount(["a", "b", "c"], { a: 2, b: 2, c: 1 });
    expect(sorted).toEqual(["a", "b", "c"]);
  });

  it("returns empty array for empty input", () => {
    expect(sortTagsByPostCount([], {})).toEqual([]);
  });
});
