import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { EXPERIENCE_GROUPS } from "@/lib/experience";
import { SKILL_CATEGORIES_SORTED } from "@/lib/skills";
import { CERTIFICATES } from "@/lib/certifications";
import { calculateYears, PROFESSIONAL_START } from "@/lib/professional-years";

export const dynamic = "force-static";

const PROFESSIONAL_YEARS = calculateYears(PROFESSIONAL_START);

export async function GET() {
  const { author, jobTitle, worksFor, linkedin, github, bluesky, siteUrl } =
    SITE_METADATA;

  const meUrl = withTrailingSlash(`${siteUrl}/me`);

  const experienceLines = EXPERIENCE_GROUPS.flatMap((group) => [
    `### ${group.heading}`,
    "",
    ...group.entries.map(
      (entry) => `- [${entry.title}](${meUrl}): ${entry.description}`
    ),
    "",
  ]);

  const skillLines = SKILL_CATEGORIES_SORTED.map(
    (cat) => `- [${cat.label}](${meUrl}): ${cat.items.join(", ")}`
  );

  const specializationLines = CERTIFICATES.filter(
    (c) => c.type === "specialization"
  ).map((c) => `- [${c.name}](${c.url}): ${c.issuer}`);

  const courseLines = CERTIFICATES.filter((c) => c.type === "course").map(
    (c) => `- [${c.name}](${c.url}): ${c.issuer}`
  );

  const lines = [
    `# ${author} — ${jobTitle}`,
    "",
    `> ${jobTitle} at ${worksFor.name} with ${PROFESSIONAL_YEARS}+ years delivering cloud-native engineering, AI systems, and data platforms for enterprises.`,
    "",
    `**URL:** ${withTrailingSlash(`${siteUrl}/me`)}`,
    `**LinkedIn:** ${linkedin}`,
    `**GitHub:** ${github}`,
    `**Bluesky:** ${bluesky}`,
    "",
    "---",
    "",
    "## Experience",
    "",
    ...experienceLines,
    "## Skills",
    "",
    ...skillLines,
    "",
    "## Certifications",
    "",
    "### Specializations",
    "",
    ...specializationLines,
    "",
    "### Courses",
    "",
    ...courseLines,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
