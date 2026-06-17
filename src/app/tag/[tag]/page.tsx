import { getAllPosts, getAllTags } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogPosting, ItemList, ListItem, WithContext } from "schema-dts";
import { buildBreadcrumbList, personJsonLd } from "@/lib/schema";
import JsonLd from "@/app/_components/json-ld";

type Params = Promise<{ tag: string }>;

export async function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { tag } = await params;
  const posts = getAllPosts().filter((p) => p.tags?.includes(tag));
  const count = posts.length;
  return {
    title: `#${tag} | ${SITE_METADATA.title}`,
    description: `${count} ${count === 1 ? "post" : "posts"} tagged #${tag} on Burak Ince's engineering blog.`,
    alternates: {
      canonical: withTrailingSlash(`${SITE_METADATA.siteUrl}/tag/${tag}`),
    },
  };
}

const TagPage = async ({ params }: { params: Params }) => {
  const { tag } = await params;
  const posts = getAllPosts().filter((p) => p.tags?.includes(tag));

  if (posts.length === 0) return notFound();

  const tagUrl = withTrailingSlash(`${SITE_METADATA.siteUrl}/tag/${tag}`);
  const tagsIndexUrl = withTrailingSlash(`${SITE_METADATA.siteUrl}/tag`);

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Posts tagged #${tag}`,
    itemListElement: posts.map((post, index): ListItem => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        "@id": withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${post.slug}`),
        headline: post.title,
        url: withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${post.slug}`),
        image: `${SITE_METADATA.siteUrl}/assets/blog/og-images/${post.slug.replace(/-/g, "_")}.png`,
        datePublished: post.date,
        dateModified: post.lastModified,
        description: post.excerpt,
        author: personJsonLd,
      } as BlogPosting,
    })),
  };

  const breadcrumbData = buildBreadcrumbList(`#${tag}`, [
    { name: "Tags", url: tagsIndexUrl },
    { name: `#${tag}`, url: tagUrl },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1 dark:text-gray-300">
        #{tag}
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>
      <Link
        href="/tag/"
        className="text-sm text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors mb-4 inline-block"
      >
        ← All Tags
      </Link>
      <div className={`grid gap-4 ${posts.length === 1 ? "grid-cols-1" : posts.length % 3 === 0 ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
        {posts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </div>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={breadcrumbData} />
    </div>
  );
};

export default TagPage;
