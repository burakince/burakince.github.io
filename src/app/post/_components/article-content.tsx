"use client";

import { useEffect, useRef } from "react";

type Props = {
  html: string;
};

export default function ArticleContent({ html }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    container.querySelectorAll("pre:has(code)").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";
      btn.setAttribute("aria-label", "Copy code to clipboard");
      pre.appendChild(btn);
    });

    const handleClick = (event: MouseEvent) => {
      const btn = (event.target as HTMLElement).closest<HTMLButtonElement>(".copy-btn");
      if (!btn) return;
      const code = btn.closest("pre")?.querySelector("code");
      if (!code) return;
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 2000);
      navigator.clipboard?.writeText(code.innerText).catch(() => {});
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
