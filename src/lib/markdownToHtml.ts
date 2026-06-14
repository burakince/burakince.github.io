import type { Root, Element, ElementContent, RootContent } from "hast";
import type { Plugin } from "unified";
import rehypeHighlight from "rehype-highlight";
import rehypeMermaid from "rehype-mermaid";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getTextContent(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return (node as Element).children.map(getTextContent).join("");
  }
  return "";
}

const rehypeLazyImages: Plugin<[], Root> = function () {
  return function (tree) {
    function visit(node: Root | RootContent | ElementContent) {
      if (node.type === "element" && (node as Element).tagName === "img") {
        (node as Element).properties = {
          ...((node as Element).properties ?? {}),
          loading: "lazy",
        };
      }
      if ("children" in node) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }
    for (const child of tree.children) {
      visit(child);
    }
  };
};

const rehypeHeadings: Plugin<[TocHeading[]], Root> = function (headings) {
  return function (tree) {
    function visit(node: Root | RootContent | ElementContent) {
      if (node.type === "element" && /^h[23]$/.test(node.tagName)) {
        const text = node.children.map(getTextContent).join("").trim();
        const id = slugify(text);
        node.properties = { ...(node.properties ?? {}), id };
        if (text) headings.push({ id, text, level: parseInt(node.tagName[1]) });
      }
      if ("children" in node) {
        for (const child of node.children) {
          visit(child);
        }
      }
    }
    for (const child of tree.children) {
      visit(child);
    }
  };
};

export default async function markdownToHtml(
  markdown: string
): Promise<{ html: string; headings: TocHeading[] }> {
  const headings: TocHeading[] = [];
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeMermaid, { strategy: "inline-svg" })
    .use(rehypeHeadings, headings)
    .use(rehypeHighlight)
    .use(rehypeLazyImages)
    .use(rehypeStringify)
    .process(markdown);
  return { html: result.toString(), headings };
}
