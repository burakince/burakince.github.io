import { Metadata } from "next";
import Image from "next/image";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Person, ProfilePage, WithContext } from "schema-dts";
import JsonLd from "@/app/_components/json-ld";
import { orgJsonLd } from "@/lib/schema";
import { ALL_SKILLS_SORTED, SKILL_CATEGORIES_SORTED } from "@/lib/skills";
import { EXPERIENCE_GROUPS } from "@/lib/experience";
import AnchorHeading from "@/app/me/_components/anchor-heading";
import PrintIconButton from "@/app/me/_components/print-icon-button";
import Link from "next/link";
import WebIcon from "@/app/_components/social-icons/web.svg";
import GmailIcon from "@/app/_components/social-icons/gmail.svg";
import LinkedinIcon from "@/app/_components/social-icons/linkedin.svg";
import GithubIcon from "@/app/_components/social-icons/github.svg";

const PROFESSIONAL_START = { year: 2012, month: 7 };
const PROGRAMMING_START = { year: 2001, month: 1 };

const calculateYears = (start: { year: number; month: number }): number => {
  const now = new Date();
  const startDate = new Date(start.year, start.month - 1, 1);

  let years = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < startDate.getDate())) {
    years--;
  }

  return years;
};

const PROFESSIONAL_YEARS = calculateYears(PROFESSIONAL_START);
const PROGRAMMING_YEARS = calculateYears(PROGRAMMING_START);

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const title = `${SITE_METADATA.author} - ${SITE_METADATA.jobTitle} with ${PROFESSIONAL_YEARS}+ Years Experience`;
const description = `${SITE_METADATA.jobTitle} with ${PROFESSIONAL_YEARS}+ years of professional experience (since ${MONTHS[PROFESSIONAL_START.month - 1]} ${PROFESSIONAL_START.year}) and ${PROGRAMMING_YEARS}+ years of programming experience (since ${PROGRAMMING_START.year}).`;

const MePage = () => {
  const myProfileJsonLd: Person = {
    "@type": "Person",
    name: SITE_METADATA.author,
    gender: "male",
    jobTitle: SITE_METADATA.jobTitle,
    worksFor: orgJsonLd,
    description: description,
    url: SITE_METADATA.siteUrl,
    image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
    sameAs: [
      SITE_METADATA.linkedin,
      SITE_METADATA.github,
      SITE_METADATA.twitter,
      SITE_METADATA.bluesky,
      SITE_METADATA.keybase,
      SITE_METADATA.huggingface,
    ],
    knowsAbout: [...ALL_SKILLS_SORTED],
  };

  const structuredData: WithContext<ProfilePage> = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-04-28T15:18:27.000Z",
    dateModified: "2026-05-27T00:00:00.000Z",
    mainEntity: myProfileJsonLd,
  };

  return (
    <div>
      <div>
        <section
          id="profile"
          className="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8"
        >
          <PrintIconButton />
          <div className="flex items-center">
            <Image
              src="/assets/me/burakince.jpg"
              width={200}
              height={250}
              alt="Burak Ince"
              className="w-24 h-24 rounded-full mr-6"
            />
            <div>
              <h1 className="text-3xl font-bold dark:text-gray-300">
                {SITE_METADATA.author}
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-500">
                {SITE_METADATA.jobTitle} at {SITE_METADATA.worksFor.name}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-slate-700 dark:text-slate-300 mb-4 print:hidden">
              Lead Consultant Developer at {SITE_METADATA.worksFor.name}, delivering cloud-native engineering, data platforms, and AI solutions for Fortune 500 enterprises across retail, automotive, healthcare, energy, and manufacturing.
            </p>
            <div className="flex flex-wrap gap-2 print:hidden">
              {[
                `${PROFESSIONAL_YEARS}+ yrs professional`,
                `${PROGRAMMING_YEARS}+ yrs programming`,
                "Full-stack",
                "Data Engineering",
                "Cloud-native",
                "MLOps",
              ].map((fact) => (
                <span
                  key={fact}
                  className="inline-block px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium"
                >
                  {fact}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 print:hidden">
              <span className="text-xs text-slate-400 dark:text-slate-500">Jump to:</span>
              <Link href="#experience" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Experience</Link>
              <Link href="#skills" className="text-xs text-violet-600 dark:text-violet-400 hover:underline">Skills</Link>
            </div>
            <div className="hidden print:flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-sm text-slate-600">
              <a href={SITE_METADATA.siteUrl} className="inline-flex items-center gap-1.5">
                <WebIcon className="fill-current size-4 shrink-0" aria-hidden="true" />
                {SITE_METADATA.siteUrl.replace("https://", "")}
              </a>
              <a href={`mailto:${SITE_METADATA.email}`} className="inline-flex items-center gap-1.5">
                <GmailIcon className="fill-current size-4 shrink-0" aria-hidden="true" />
                {SITE_METADATA.email}
              </a>
              <a href={SITE_METADATA.linkedin} className="inline-flex items-center gap-1.5">
                <LinkedinIcon className="fill-current size-4 shrink-0" aria-hidden="true" />
                linkedin.com/in/inceburak
              </a>
              <a href={SITE_METADATA.github} className="inline-flex items-center gap-1.5">
                <GithubIcon className="fill-current size-4 shrink-0" aria-hidden="true" />
                github.com/burakince
              </a>
            </div>
          </div>
        </section>
      </div>

      <section
        id="experience"
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 mb-8"
      >
        <AnchorHeading id="experience" className="text-2xl font-bold mb-4 dark:text-gray-300">Experience</AnchorHeading>
        <div className="space-y-6">
          {EXPERIENCE_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-xl font-semibold mb-2 dark:text-gray-200">
                {group.heading}
              </h3>
              {group.entries.map((entry) => (
                <div
                  key={entry.title}
                  className="pl-4 border-l-2 border-slate-200 dark:border-slate-700 mb-5 print:break-inside-avoid"
                >
                  <h4 className="font-semibold dark:text-gray-100">
                    {entry.title}
                  </h4>
                  <p className="dark:text-gray-300">{entry.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section
        id="skills"
        className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6"
      >
        <AnchorHeading id="skills" className="text-2xl font-bold mb-4 dark:text-gray-300">Skills</AnchorHeading>
        <div className="space-y-4">
          {SKILL_CATEGORIES_SORTED.map(({ label, items }) => (
            <div key={label} className="print:break-inside-avoid">
              <h3 className="font-semibold mb-1.5 dark:text-gray-200">{label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="inline-block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <JsonLd data={structuredData} />
    </div>
  );
};

export const metadata: Metadata = {
  title: title,
  description: description,
  keywords: [
    SITE_METADATA.author,
    "lead developer",
    "professional experience",
    "programming",
    "software development",
    "AI",
    "machine learning",
    "data engineering",
    "web development",
    "IoT",
    "AWS",
    "Terraform",
    "Python",
    "Golang",
    "Kubernetes",
    "Helm",
  ],
  alternates: {
    canonical: `${SITE_METADATA.siteUrl}/me/`,
  },
  openGraph: {
    type: "profile",
    images: [`${SITE_METADATA.siteUrl}/assets/me/burakince.jpg`],
    url: `${SITE_METADATA.siteUrl}/me/`,
    title: title,
    description: description,
    emails: SITE_METADATA.email,
    siteName: SITE_METADATA.title,
    locale: SITE_METADATA.locale,
    firstName: "Burak",
    lastName: "Ince",
    gender: "male",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@burakinc",
    images: [`${SITE_METADATA.siteUrl}/assets/me/burakince.jpg`],
    title,
    description,
  },
};

export default MePage;
