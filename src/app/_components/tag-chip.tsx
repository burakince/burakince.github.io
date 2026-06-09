import Link from "next/link";

type Props = {
  tag: string;
  size?: "sm" | "md";
};

const TagChip = ({ tag, size = "sm" }: Props) => (
  <Link
    href={`/tag/${tag}/`}
    className={`inline-block rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:hover:bg-violet-800/60 transition-colors font-medium ${
      size === "md"
        ? "px-3 py-1 text-sm font-semibold"
        : "px-2 py-0.5 text-xs"
    }`}
  >
    #{tag}
  </Link>
);

export default TagChip;
