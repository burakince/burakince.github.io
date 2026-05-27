import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";
import { Organization, Person, ProfilePage, WebSite, WithContext } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";
import JsonLd from "@/app/_components/json-ld";
import { Metadata } from "next";

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
    url: `${SITE_METADATA.siteUrl}/me/`,
    image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
  };

  const websiteJsonLd: WithContext<WebSite> = {
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

  const profilePageJsonLd: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-04-28T15:18:27.000Z",
    url: `${SITE_METADATA.siteUrl}/`,
    mainEntity: meJsonLd,
  };

  const allPosts = getAllPosts();
  const allPostPreviews = allPosts.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-300">
        Latest Posts
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPostPreviews}
      </div>
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={profilePageJsonLd} />
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
