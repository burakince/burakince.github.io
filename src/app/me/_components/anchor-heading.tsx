"use client";
import { useState } from "react";

type Props = {
  id: string;
  children: string;
  className?: string;
};

export default function AnchorHeading({ id, children, className }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <h2 className={`group flex items-center gap-2 ${className ?? ""}`}>
      <a href={`#${id}`} className="hover:underline">
        {children}
      </a>
      <button
        onClick={handleCopy}
        aria-label={`Copy link to ${children} section`}
        className="print:hidden opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-violet-500 dark:hover:text-violet-400 text-base font-normal"
      >
        {copied ? (
          <span className="text-xs text-green-500">Copied!</span>
        ) : (
          "#"
        )}
      </button>
    </h2>
  );
}
