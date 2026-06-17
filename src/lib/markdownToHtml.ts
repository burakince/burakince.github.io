import type { Root, Element, ElementContent, RootContent } from "hast";
import type { Plugin } from "unified";
import rehypeHighlight from "rehype-highlight";
import { common } from "lowlight";
import cypher from "highlightjs-cypher";
import rehypeMermaid from "rehype-mermaid";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import sharp from "sharp";
import path from "path";
import fs from "fs";

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function getTextContent(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return (node as Element).children.map(getTextContent).join("");
  }
  return "";
}

export const rehypeMermaidA11y: Plugin<[], Root> = function () {
  return function (tree) {
    let lastHeadingText = "Diagram";
    function visit(node: Root | RootContent | ElementContent) {
      if (node.type === "element") {
        const el = node as Element;
        if (/^h[1-6]$/.test(el.tagName)) {
          lastHeadingText = el.children.map(getTextContent).join("").trim() || "Diagram";
        }
        // inline-svg strategy: aria-label on the SVG element
        if (el.tagName === "svg" && el.properties?.ariaRoleDescription) {
          el.properties.ariaLabel = lastHeadingText;
        }
        // img-svg strategy: alt on the <img> inside a <picture>
        const idStr = String(el.properties?.id ?? "");
        if (el.tagName === "img" && idStr.startsWith("mermaid-")) {
          el.properties!.alt = lastHeadingText;
        }
      }
      if ("children" in node) {
        for (const child of node.children) visit(child);
      }
    }
    for (const child of tree.children) visit(child);
  };
};

const rehypeImgSize: Plugin<[], Root> = function () {
  return async function (tree) {
    const tasks: Promise<void>[] = [];

    function collect(node: Root | RootContent | ElementContent) {
      if (node.type === "element") {
        const el = node as Element;
        if (el.tagName === "img") {
          const src = el.properties?.src as string | undefined;
          if (src && src.startsWith("/")) {
            const filePath = path.join(process.cwd(), "public", src);
            if (fs.existsSync(filePath)) {
              tasks.push(
                sharp(filePath)
                  .metadata()
                  .then(({ width, height }) => {
                    if (width) el.properties!.width = width;
                    if (height) el.properties!.height = height;
                  })
                  .catch(() => {})
              );
            }
          }
        }
      }
      if ("children" in node) {
        for (const child of node.children) collect(child);
      }
    }

    for (const child of tree.children) collect(child);
    await Promise.all(tasks);
  };
};

export const rehypePreTabindex: Plugin<[], Root> = function () {
  return function (tree) {
    function visit(node: Root | RootContent | ElementContent) {
      if (node.type === "element" && (node as Element).tagName === "pre") {
        (node as Element).properties = {
          ...((node as Element).properties ?? {}),
          tabIndex: 0,
        };
      }
      if ("children" in node) {
        for (const child of node.children) visit(child);
      }
    }
    for (const child of tree.children) visit(child);
  };
};

export const rehypeLazyImages: Plugin<[], Root> = function () {
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

export const rehypeHeadings: Plugin<[TocHeading[]], Root> = function (headings) {
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
    .use(rehypeMermaid, { strategy: "img-svg", dark: { theme: "dark" } })
    .use(rehypeMermaidA11y)
    .use(rehypeHeadings, headings)
    .use(rehypeHighlight, { languages: { ...common, cypher } })
    .use(rehypeImgSize)
    .use(rehypeLazyImages)
    .use(rehypePreTabindex)
    .use(rehypeStringify)
    .process(markdown);
  return { html: result.toString(), headings };
}
