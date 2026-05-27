import { Organization } from "schema-dts";
import { SITE_METADATA } from "@/lib/site-metadata";

export const orgJsonLd: Organization = {
  "@type": "Organization",
  name: SITE_METADATA.worksFor.name,
  url: SITE_METADATA.worksFor.url,
  logo: SITE_METADATA.worksFor.logo,
};
