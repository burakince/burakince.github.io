import { describe, it, expect } from "vitest";
import {
  slugify,
  getTextContent,
  rehypeHeadings,
  rehypeLazyImages,
  rehypePreTabindex,
  rehypeMermaidA11y,
} from "@/lib/markdownToHtml";
import type { TocHeading } from "@/lib/markdownToHtml";

// ─── HAST node builders ───────────────────────────────────────────────────────

function text(value: string) {
  return { type: "text" as const, value };
}

function el(
  tagName: string,
  children: unknown[] = [],
  properties: Record<string, unknown> = {}
) {
  return { type: "element" as const, tagName, properties, children };
}

function root(children: unknown[]) {
  return { type: "root" as const, children };
}

// ─── Plugin call helpers ──────────────────────────────────────────────────────

// Calls a zero-arg plugin factory and runs the returned transformer on the tree
function run(plugin: unknown, tree: unknown) {
  (plugin as any)()(tree);
}

function runHeadings(tree: unknown): TocHeading[] {
  const headings: TocHeading[] = [];
  (rehypeHeadings as any)(headings)(tree);
  return headings;
}

// ─── slugify ─────────────────────────────────────────────────────────────────

describe("slugify", () => {
  it("lowercases text", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("one two three")).toBe("one-two-three");
  });

  it("collapses multiple spaces into one hyphen", () => {
    // \s+ matches greedily so multiple spaces produce a single hyphen
    expect(slugify("one  two")).toBe("one-two");
  });

  it("strips special characters", () => {
    expect(slugify("What is gRPC?")).toBe("what-is-grpc");
  });

  it("preserves hyphens", () => {
    expect(slugify("Cloud-Native Architecture")).toBe("cloud-native-architecture");
  });

  it("preserves numbers", () => {
    expect(slugify("Top 10 Tips")).toBe("top-10-tips");
  });

  it("trims leading and trailing whitespace", () => {
    expect(slugify("  heading  ")).toBe("heading");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });

  it("strips punctuation that would break anchor links", () => {
    // Parentheses, dots, colons silently vanish — a regression here breaks all ToC links
    expect(slugify("OAuth 2.0 (OIDC)")).toBe("oauth-20-oidc");
  });
});

// ─── getTextContent ───────────────────────────────────────────────────────────

describe("getTextContent", () => {
  it("returns the value of a text node", () => {
    expect(getTextContent(text("hello") as any)).toBe("hello");
  });

  it("returns empty string for non-text non-element nodes (e.g. comment)", () => {
    expect(getTextContent({ type: "comment", value: "x" } as any)).toBe("");
  });

  it("returns concatenated text from element children", () => {
    expect(getTextContent(el("strong", [text("bold")]) as any)).toBe("bold");
  });

  it("recursively extracts text from nested elements", () => {
    const node = el("p", [text("Hello "), el("strong", [text("world")])]);
    expect(getTextContent(node as any)).toBe("Hello world");
  });

  it("returns empty string for an element with no children", () => {
    expect(getTextContent(el("br") as any)).toBe("");
  });
});

// ─── rehypeHeadings ───────────────────────────────────────────────────────────

describe("rehypeHeadings", () => {
  it("assigns a slugified id to h2 elements", () => {
    const tree = root([el("h2", [text("My Heading")])]);
    runHeadings(tree);
    expect((tree.children[0] as any).properties.id).toBe("my-heading");
  });

  it("assigns a slugified id to h3 elements", () => {
    const tree = root([el("h3", [text("Sub Heading")])]);
    runHeadings(tree);
    expect((tree.children[0] as any).properties.id).toBe("sub-heading");
  });

  it("collects headings with correct text and level", () => {
    const tree = root([
      el("h2", [text("First")]),
      el("h3", [text("Second")]),
    ]);
    const headings = runHeadings(tree);
    expect(headings).toEqual([
      { id: "first", text: "First", level: 2 },
      { id: "second", text: "Second", level: 3 },
    ]);
  });

  it("does not process h1 elements", () => {
    const tree = root([el("h1", [text("Title")])]);
    const headings = runHeadings(tree);
    expect(headings).toHaveLength(0);
    expect((tree.children[0] as any).properties.id).toBeUndefined();
  });

  it("skips headings with no text content", () => {
    const tree = root([el("h2", [])]);
    const headings = runHeadings(tree);
    expect(headings).toHaveLength(0);
  });

  it("processes headings nested inside other elements", () => {
    const tree = root([el("div", [el("h2", [text("Nested")])])]);
    const headings = runHeadings(tree);
    expect(headings).toEqual([{ id: "nested", text: "Nested", level: 2 }]);
  });
});

// ─── rehypeLazyImages ─────────────────────────────────────────────────────────

describe("rehypeLazyImages", () => {
  it("adds loading=lazy to img elements", () => {
    const tree = root([el("img", [], { src: "/foo.png" })]);
    run(rehypeLazyImages, tree);
    expect((tree.children[0] as any).properties.loading).toBe("lazy");
  });

  it("does not modify non-img elements", () => {
    const tree = root([el("p", [text("text")])]);
    run(rehypeLazyImages, tree);
    expect((tree.children[0] as any).properties.loading).toBeUndefined();
  });

  it("processes img elements nested inside other elements", () => {
    const img = el("img", [], { src: "/nested.png" });
    const tree = root([el("figure", [img])]);
    run(rehypeLazyImages, tree);
    expect(img.properties.loading).toBe("lazy");
  });

  it("preserves existing properties on img", () => {
    const tree = root([el("img", [], { src: "/foo.png", alt: "desc" })]);
    run(rehypeLazyImages, tree);
    const props = (tree.children[0] as any).properties;
    expect(props.src).toBe("/foo.png");
    expect(props.alt).toBe("desc");
    expect(props.loading).toBe("lazy");
  });
});

// ─── rehypePreTabindex ────────────────────────────────────────────────────────

describe("rehypePreTabindex", () => {
  it("adds tabIndex=0 to pre elements", () => {
    const tree = root([el("pre")]);
    run(rehypePreTabindex, tree);
    expect((tree.children[0] as any).properties.tabIndex).toBe(0);
  });

  it("does not modify non-pre elements", () => {
    const tree = root([el("code")]);
    run(rehypePreTabindex, tree);
    expect((tree.children[0] as any).properties.tabIndex).toBeUndefined();
  });

  it("preserves existing properties on pre", () => {
    const tree = root([el("pre", [], { className: ["highlight"] })]);
    run(rehypePreTabindex, tree);
    const props = (tree.children[0] as any).properties;
    expect(props.className).toEqual(["highlight"]);
    expect(props.tabIndex).toBe(0);
  });
});

// ─── rehypeMermaidA11y ────────────────────────────────────────────────────────

describe("rehypeMermaidA11y", () => {
  it("sets alt on mermaid img using nearest preceding heading", () => {
    const tree = root([
      el("h2", [text("System Architecture")]),
      el("img", [], { id: "mermaid-0" }),
    ]);
    run(rehypeMermaidA11y, tree);
    expect((tree.children[1] as any).properties.alt).toBe("System Architecture");
  });

  it("defaults alt to 'Diagram' when no heading precedes the mermaid img", () => {
    const tree = root([el("img", [], { id: "mermaid-0" })]);
    run(rehypeMermaidA11y, tree);
    expect((tree.children[0] as any).properties.alt).toBe("Diagram");
  });

  it("does not set alt on non-mermaid img elements", () => {
    const tree = root([el("img", [], { src: "/photo.png" })]);
    run(rehypeMermaidA11y, tree);
    expect((tree.children[0] as any).properties.alt).toBeUndefined();
  });

  it("sets aria-label on inline SVG that has ariaRoleDescription", () => {
    const tree = root([
      el("h2", [text("Flow Diagram")]),
      el("svg", [], { ariaRoleDescription: "graphics-document" }),
    ]);
    run(rehypeMermaidA11y, tree);
    expect((tree.children[1] as any).properties.ariaLabel).toBe("Flow Diagram");
  });

  it("does not set aria-label on SVG without ariaRoleDescription", () => {
    const tree = root([el("svg", [])]);
    run(rehypeMermaidA11y, tree);
    expect((tree.children[0] as any).properties.ariaLabel).toBeUndefined();
  });

  it("tracks the most recent heading for each diagram independently", () => {
    const img1 = el("img", [], { id: "mermaid-0" });
    const img2 = el("img", [], { id: "mermaid-1" });
    const tree = root([
      el("h2", [text("First Section")]),
      img1,
      el("h2", [text("Second Section")]),
      img2,
    ]);
    run(rehypeMermaidA11y, tree);
    expect(img1.properties.alt).toBe("First Section");
    expect(img2.properties.alt).toBe("Second Section");
  });
});
