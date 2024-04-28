import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import { WebSite, WithContext } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";

const HomePage = () => {
  const jsonLd: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_METADATA.title,
    url: SITE_METADATA.siteUrl,
    description: SITE_METADATA.description,
    author: {
      "@type": "Person",
      name: SITE_METADATA.author,
      url: `${SITE_METADATA.siteUrl}/me`,
    },
    publisher: {
      "@type": "Person",
      name: SITE_METADATA.author,
      url: `${SITE_METADATA.siteUrl}/me`,
    },
  };
  const allPosts = getAllPosts();
  const allPostPreviews = allPosts.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPostPreviews}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
};

export default HomePage;
