import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import Pagination from "@/app/_components/pagination";
import { Blog, Person, WebSite, WithContext } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";
import { orgJsonLd } from "@/lib/schema";
import JsonLd from "@/app/_components/json-ld";
import { Metadata } from "next";

const POSTS_PER_PAGE = 4;

const HomePage = () => {
  const meJsonLd: Person = {
    "@type": "Person",
    name: SITE_METADATA.author,
    jobTitle: SITE_METADATA.jobTitle,
    worksFor: orgJsonLd,
    url: `${SITE_METADATA.siteUrl}/me/`,
    image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
  };

  const websiteJsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_METADATA.title,
    url: `${SITE_METADATA.siteUrl}/`,
    inLanguage: "en-US",
    isFamilyFriendly: true,
    accountablePerson: meJsonLd,
    author: meJsonLd,
    creator: meJsonLd,
    publisher: meJsonLd,
    description: SITE_METADATA.description,
  };

  const blogJsonLd: WithContext<Blog> = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: SITE_METADATA.title,
    description: SITE_METADATA.description,
    url: `${SITE_METADATA.siteUrl}/`,
    inLanguage: "en-US",
    author: meJsonLd,
    creator: meJsonLd,
    publisher: meJsonLd,
  };

  const allPosts = getAllPosts();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

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
    </div>
  );
};

export const metadata: Metadata = {
  alternates: {
    canonical: `${SITE_METADATA.siteUrl}/`,
  },
  openGraph: {
    type: "website",
    url: `${SITE_METADATA.siteUrl}/`,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: [`${SITE_METADATA.siteUrl}/assets/open-graph-image.jpg`],
    siteName: SITE_METADATA.title,
    locale: SITE_METADATA.locale,
  },
};

export default HomePage;
