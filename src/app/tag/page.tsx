import { getAllPosts, getAllTags } from "@/lib/api";
import TagChip from "@/app/_components/tag-chip";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Tags | ${SITE_METADATA.title}`,
  alternates: {
    canonical: withTrailingSlash(`${SITE_METADATA.siteUrl}/tag`),
  },
};

const TagsIndexPage = () => {
  const allPosts = getAllPosts();
  const tags = getAllTags();

  const countByTag = Object.fromEntries(
    tags.map((tag) => [
      tag,
      allPosts.filter((p) => p.tags?.includes(tag)).length,
    ])
  );

  const sortedTags = [...tags].sort(
    (a, b) => countByTag[b] - countByTag[a]
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-300">Tags</h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
        Browse all topics. Click a tag to see related posts.
      </p>
      <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
        {tags.length} topics &middot; {allPosts.length} posts
      </p>
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
        {sortedTags.map((tag) => (
          <dd key={tag} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <TagChip tag={tag} size={countByTag[tag] >= 3 ? "md" : "sm"} />
            <span className="text-xs text-slate-600 dark:text-slate-400 tabular-nums">
              {countByTag[tag]} {countByTag[tag] === 1 ? "post" : "posts"}
            </span>
          </dd>
        ))}
      </dl>
    </div>
  );
};

export default TagsIndexPage;
