import { getAllPosts, getAllTags } from "@/lib/api";
import { countPostsByTag, sortTagsByPostCount } from "@/lib/tags";
import TagChip from "@/app/_components/tag-chip";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { Metadata } from "next";
import { buildBreadcrumbList } from "@/lib/schema";
import JsonLd from "@/app/_components/json-ld";

const allPosts = getAllPosts();
const allTags = getAllTags();

export const metadata: Metadata = {
  title: `Tags | ${SITE_METADATA.title}`,
  description: `Browse ${allTags.length} topics across ${allPosts.length} posts on Burak Ince's engineering blog. Find posts on AI, cloud-native engineering, and software craftsmanship.`,
  alternates: {
    canonical: withTrailingSlash(`${SITE_METADATA.siteUrl}/tag`),
  },
};

const TagsIndexPage = () => {
  const countByTag = countPostsByTag(allPosts, allTags);
  const sortedTags = sortTagsByPostCount(allTags, countByTag);

  const tagsUrl = withTrailingSlash(`${SITE_METADATA.siteUrl}/tag`);
  const breadcrumbData = buildBreadcrumbList("Tags", [
    { name: "Tags", url: tagsUrl },
  ]);

  return (
    <div>
      <JsonLd data={breadcrumbData} />
      <h1 className="text-2xl font-bold mb-2 dark:text-gray-300">Tags</h1>
      <p className="text-base text-slate-700 dark:text-slate-400 mb-1">
        Browse all topics. Click a tag to see related posts.
      </p>
      <p className="text-xs text-slate-700 dark:text-slate-400 mb-6">
        {allTags.length} topics &middot; {allPosts.length} posts
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
        {sortedTags.map((tag) => (
          <li key={tag} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <TagChip tag={tag} size={countByTag[tag] >= 3 ? "md" : "sm"} />
            <span className="text-xs text-slate-700 dark:text-slate-400 tabular-nums">
              {countByTag[tag]} {countByTag[tag] === 1 ? "post" : "posts"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsIndexPage;
