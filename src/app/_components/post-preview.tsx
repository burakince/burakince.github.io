import Link from "next/link";
import DateFormatter from "./date-formatter";

type Props = {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
};

const PostPreview = ({ title, date, excerpt, slug }: Props) => {
  return (
    <div className="border border-slate-300 p-4 rounded-md shadow-sm bg-white dark:bg-slate-900">
      <DateFormatter dateString={date} />
      <Link as={`/post/${slug}`} href="/post/[slug]">
        <h2 className="text-violet-600 dark:text-violet-500 hover:underline mb-4">
          {title}
        </h2>
      </Link>
      <p className="text-slate-700 dark:text-slate-500">{excerpt}</p>
    </div>
  );
};

export default PostPreview;
