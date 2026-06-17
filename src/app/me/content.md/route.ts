import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { EXPERIENCE_GROUPS } from "@/lib/experience";
import { SKILL_CATEGORIES_SORTED } from "@/lib/skills";
import { CERTIFICATES } from "@/lib/certifications";
import { calculateYears } from "@/lib/professional-years";

export const dynamic = "force-static";

const PROFESSIONAL_YEARS = calculateYears({ year: 2012, month: 7 });

export async function GET() {
  const { author, jobTitle, worksFor, linkedin, github, bluesky, siteUrl } =
    SITE_METADATA;

  const meUrl = withTrailingSlash(`${siteUrl}/me`);

  const frontMatter = [
    "---",
    `name: "${author}"`,
    `jobTitle: "${jobTitle}"`,
    `company: "${worksFor.name}"`,
    `url: "${meUrl}"`,
    "---",
  ].join("\n");

  const experienceLines = EXPERIENCE_GROUPS.flatMap((group) => [
    `### ${group.heading}`,
    "",
    ...group.entries.map(
      (entry) => `- **${entry.title}**: ${entry.description}`
    ),
    "",
  ]);

  const skillLines = SKILL_CATEGORIES_SORTED.map(
    (cat) => `- **${cat.label}**: ${cat.items.join(", ")}`
  );

  const specializationLines = CERTIFICATES.filter(
    (c) => c.type === "specialization"
  ).map((c) => `- [${c.name}](${c.url}) — ${c.issuer}`);

  const courseLines = CERTIFICATES.filter((c) => c.type === "course").map(
    (c) => `- [${c.name}](${c.url}) — ${c.issuer}`
  );

  const lines = [
    frontMatter,
    "",
    `# ${author} — ${jobTitle}`,
    "",
    `> ${jobTitle} at ${worksFor.name} with ${PROFESSIONAL_YEARS}+ years delivering cloud-native engineering, AI systems, and data platforms for enterprises.`,
    "",
    `- **LinkedIn**: ${linkedin}`,
    `- **GitHub**: ${github}`,
    `- **Bluesky**: ${bluesky}`,
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
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
