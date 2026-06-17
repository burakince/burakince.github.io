import { describe, it, expect } from "vitest";
import { withTrailingSlash } from "@/lib/url";

describe("withTrailingSlash", () => {
  it("adds a trailing slash to a URL with none", () => {
    expect(withTrailingSlash("https://example.com")).toBe("https://example.com/");
  });

  it("is idempotent on a URL that already has a trailing slash", () => {
    expect(withTrailingSlash("https://example.com/")).toBe("https://example.com/");
  });

  it("collapses multiple trailing slashes to one", () => {
    expect(withTrailingSlash("https://example.com///")).toBe("https://example.com/");
  });

  it("adds a trailing slash to a path without host", () => {
    expect(withTrailingSlash("/post/my-slug")).toBe("/post/my-slug/");
  });

  it("adds trailing slash to empty string producing root slash", () => {
    expect(withTrailingSlash("")).toBe("/");
  });

  it("keeps root slash as root slash", () => {
    expect(withTrailingSlash("/")).toBe("/");
  });

  it("handles nested paths", () => {
    expect(withTrailingSlash("/tag/typescript")).toBe("/tag/typescript/");
  });
});
