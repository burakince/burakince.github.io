import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import Pagination from "@/app/_components/pagination";
import { Blog, BlogPosting, ItemList, ListItem, WebSite, WithContext } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { personJsonLd } from "@/lib/schema";
import JsonLd from "@/app/_components/json-ld";
import { Metadata } from "next";

const POSTS_PER_PAGE = 4;

const HomePage = () => {
  const websiteJsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_METADATA.title,
    url: withTrailingSlash(SITE_METADATA.siteUrl),
    inLanguage: "en-US",
    isFamilyFriendly: true,
    accountablePerson: personJsonLd,
    author: personJsonLd,
    creator: personJsonLd,
    publisher: personJsonLd,
    description: SITE_METADATA.description,
  };

  const blogJsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: withTrailingSlash(SITE_METADATA.siteUrl),
    inLanguage: "en-US",
    author: personJsonLd,
    creator: personJsonLd,
    publisher: personJsonLd,
  };

  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-300">
        Latest Posts
      </h1>
      <div className={`grid gap-4 ${posts.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {posts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={1} totalPages={totalPages} totalPosts={allPosts.length} />
      )}
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={blogJsonLd} />
      <JsonLd data={itemListJsonLd} />
    </div>
  );
};

export const metadata: Metadata = {
  alternates: {
    canonical: withTrailingSlash(SITE_METADATA.siteUrl),
  },
  openGraph: {
    type: "website",
    url: withTrailingSlash(SITE_METADATA.siteUrl),
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [`${SITE_METADATA.siteUrl}/assets/open-graph-image.jpg`],
    siteName: SITE_METADATA.title,
    locale: SITE_METADATA.locale,
  },
};

export default HomePage;
