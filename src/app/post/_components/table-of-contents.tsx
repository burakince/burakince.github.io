import { TocHeading } from "@/lib/markdownToHtml";

type Props = {
  headings: TocHeading[];
};

export default function TableOfContents({ headings }: Props) {
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-8 text-sm"
    >
      <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">
        Contents
      </p>
      <ol className="space-y-1">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "pl-4" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className={`text-violet-800 dark:text-violet-400 hover:underline ${
                heading.level === 3
                  ? "text-xs text-slate-700 dark:text-slate-400"
                  : ""
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
