import { Organization, Person } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { ALL_SKILLS_SORTED } from "@/lib/skills";

export const orgJsonLd: Organization = {
  "@type": "Organization",
  "@id": SITE_METADATA.worksFor.url,
  name: SITE_METADATA.worksFor.name,
  url: SITE_METADATA.worksFor.url,
  logo: SITE_METADATA.worksFor.logo,
};

export const personJsonLd = {
  "@type": "Person" as const,
  "@id": withTrailingSlash(`${SITE_METADATA.siteUrl}/me`),
  name: SITE_METADATA.author,
  gender: "male",
  jobTitle: SITE_METADATA.jobTitle,
  worksFor: orgJsonLd,
  url: withTrailingSlash(`${SITE_METADATA.siteUrl}/me`),
  image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
  sameAs: [
    SITE_METADATA.linkedin,
    SITE_METADATA.github,
    SITE_METADATA.twitter,
    SITE_METADATA.bluesky,
    SITE_METADATA.keybase,
    SITE_METADATA.huggingface,
    SITE_METADATA.credly,
    SITE_METADATA.microsoftLearn,
    SITE_METADATA.googleSkills,
  ],
  knowsAbout: [...ALL_SKILLS_SORTED],
} satisfies Person;
