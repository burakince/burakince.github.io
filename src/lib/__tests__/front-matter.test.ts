import { describe, it, expect } from "vitest";
import { matter } from "@/lib/front-matter";

describe("matter", () => {
  it("returns empty data and original input when no front matter is present", () => {
    const input = "Hello world";
    expect(matter(input)).toEqual({ data: {}, content: input });
  });

  it("parses empty front matter block (blank YAML section)", () => {
    // The regex requires a newline before the closing ---, so a blank line is needed
    const result = matter("---\n\n---\n");
    expect(result.data).toEqual({});
    expect(result.content).toBe("");
  });

  it("parses string fields", () => {
    const input = "---\ntitle: My Post\nexcerpt: A short description\n---\n";
    const { data } = matter(input);
    expect(data.title).toBe("My Post");
    expect(data.excerpt).toBe("A short description");
  });

  it("parses a tags array", () => {
    const input = "---\ntags:\n  - typescript\n  - nextjs\n---\n";
    const { data } = matter(input);
    expect(Array.isArray(data.tags)).toBe(true);
    expect(data.tags).toEqual(["typescript", "nextjs"]);
  });

  it("returns a quoted ISO date as a string", () => {
    // Real post front matter always quotes dates — this is the format used in production
    const input = '---\ndate: "2024-04-27T00:00:00.000Z"\n---\n';
    const { data } = matter(input);
    expect(typeof data.date).toBe("string");
    expect(data.date).toBe("2024-04-27T00:00:00.000Z");
  });

  it("handles CRLF line endings", () => {
    const input = "---\r\ntitle: CRLF Post\r\n---\r\ncontent here";
    const { data, content } = matter(input);
    expect(data.title).toBe("CRLF Post");
    expect(content).toBe("content here");
  });

  it("returns multi-paragraph content intact", () => {
    const input = "---\ntitle: Test\n---\nParagraph one.\n\nParagraph two.";
    const { content } = matter(input);
    expect(content).toBe("Paragraph one.\n\nParagraph two.");
  });

  it("parses a complete post-style front matter block", () => {
    const input = [
      "---",
      "title: \"My Blog Post\"",
      "excerpt: \"A test excerpt\"",
      'date: "2024-01-15T10:00:00.000Z"',
      'lastModified: "2024-01-15T10:00:00.000Z"',
      "tags:",
      "  - typescript",
      "  - testing",
      "---",
      "# Content starts here",
    ].join("\n");
    const { data, content } = matter(input);
    expect(data.title).toBe("My Blog Post");
    expect(data.tags).toEqual(["typescript", "testing"]);
    expect(content).toBe("# Content starts here");
  });
});
