import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import { Organization, Person, WebSite, WithContext } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";
import JsonLd from "@/app/_components/json-ld";

const HomePage = () => {
  const orgJsonLd: Organization = {
    "@type": "Organization",
    name: SITE_METADATA.worksFor.name,
    url: SITE_METADATA.worksFor.url,
    logo: SITE_METADATA.worksFor.logo,
  };

  const meJsonLd: Person = {
    "@type": "Person",
    name: SITE_METADATA.author,
    jobTitle: SITE_METADATA.jobTitle,
    worksFor: orgJsonLd,
    url: `${SITE_METADATA.siteUrl}/me`,
    image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
  };

  const structuredData: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_METADATA.title,
    url: SITE_METADATA.siteUrl,
    inLanguage: "en-US",
    isFamilyFriendly: true,
    accountablePerson: meJsonLd,
    author: meJsonLd,
    creator: meJsonLd,
    publisher: meJsonLd,
    description: SITE_METADATA.description,
  };
  const allPosts = getAllPosts();
  const allPostPreviews = allPosts.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPostPreviews}
      </div>
      <JsonLd data={structuredData} />
    </div>
  );
};

export default HomePage;
