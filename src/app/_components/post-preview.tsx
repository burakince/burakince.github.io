import Link from "next/link";
import DateFormatter from "./date-formatter";
import { smartTruncate } from "@/lib/truncate";
import { readingTime } from "@/lib/reading-time";
import TagChip from "./tag-chip";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  tags?: string[];
  content?: string;
};

const PostPreview = ({ title, date, excerpt, slug, tags, content }: Props) => {
  const mins = content ? readingTime(content) : null;
  return (
    <div className="border border-slate-200 dark:border-slate-700 p-4 rounded-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-1">
        <DateFormatter dateString={date} />
        {mins !== null && <span>· {mins} min read</span>}
      </div>
      <Link href={`/post/${slug}/`}>
        <h2 className="text-violet-700 dark:text-violet-300 hover:underline mb-3">
          {title}
        </h2>
      </Link>
      <p className="text-slate-700 dark:text-slate-500">{smartTruncate(excerpt)}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostPreview;
