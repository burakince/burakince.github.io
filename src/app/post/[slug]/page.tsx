import DateFormatter from "@/app/_components/date-formatter";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPosting, Person, WithContext } from "schema-dts";
import { orgJsonLd } from "@/lib/schema";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import yaml from "highlight.js/lib/languages/yaml";
import ArticleContent from "@/app/post/_components/article-content";
import TableOfContents from "@/app/post/_components/table-of-contents";
import JsonLd from "@/app/_components/json-ld";
import { Params } from "@/interfaces/post";
import { generateImage } from "@/lib/og-generator";
import OgTemplate from "@/app/_components/og-template";
import TagChip from "@/app/_components/tag-chip";
import Link from "next/link";
import { readingTime } from "@/lib/reading-time";
import { withTrailingSlash } from "@/lib/url";
import XIcon from "@/app/_components/social-icons/x.svg";
import LinkedinIcon from "@/app/_components/social-icons/linkedin.svg";
import BlueskyIcon from "@/app/_components/social-icons/bluesky.svg";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("yaml", yaml);

const imageSize = {
  width: 1200,
  height: 630,
};

const meJsonLd: Person = {
  "@type": "Person",
  name: SITE_METADATA.author,
  jobTitle: SITE_METADATA.jobTitle,
  worksFor: orgJsonLd,
  url: withTrailingSlash(`${SITE_METADATA.siteUrl}/me`),
  image: `${SITE_METADATA.siteUrl}/assets/me/burakince.webp`,
};

const PostPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const ogImage = await generateImage({
    template: <OgTemplate title={post.title} excerpt={post.excerpt} />,
    slug: post.slug,
    options: imageSize,
  });

  const structuredData: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    image: `${SITE_METADATA.siteUrl}${ogImage}`,
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: SITE_METADATA.locale,
    isFamilyFriendly: true,
    accountablePerson: meJsonLd,
    author: meJsonLd,
    creator: meJsonLd,
    publisher: meJsonLd,
    description: post.excerpt,
    keywords: post.tags?.join(", "),
  };

  const { html, headings } = await markdownToHtml(post.content || "");

  const postUrl = withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${slug}`);
  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`;
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
  const blueskyShareUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${post.title} ${postUrl}`)}`;

  return (
    <div>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-md px-8 py-12 mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-snug">
          {post.title}
        </h1>
        <p className="text-slate-400 text-sm mb-4">
          <DateFormatter dateString={post.date} />
          <span className="mx-2">·</span>
          {readingTime(post.content)} min read
        </p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5">
            {post.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <TableOfContents headings={headings} />
      <article className="prose dark:prose-invert lg:prose-xl mx-auto">
        <ArticleContent html={html} />
      </article>
      <div className="mt-8 flex items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-400">Share:</span>
        <a href={xShareUrl} target="_blank" rel="noopener noreferrer" title="Share on X">
          <span className="sr-only">Share on X</span>
          <XIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-5" />
        </a>
        <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer" title="Share on LinkedIn">
          <span className="sr-only">Share on LinkedIn</span>
          <LinkedinIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-5" />
        </a>
        <a href={blueskyShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Bluesky">
          <span className="sr-only">Share on Bluesky</span>
          <BlueskyIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-5" />
        </a>
      </div>
      <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-4 items-center justify-between">
        <Link href="/" className="text-sm text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors">
          ← All Posts
        </Link>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
      <JsonLd data={structuredData} />
    </div>
  );
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Burak Ince`;

  return {
    title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${slug}`),
    },
    openGraph: {
      type: "article",
      images: [
        `${SITE_METADATA.siteUrl}/assets/blog/og-images/${slug.replace(/-/g, "_")}.png`,
      ],
      url: withTrailingSlash(`${SITE_METADATA.siteUrl}/post/${slug}`),
      title,
      description: post.excerpt,
      emails: SITE_METADATA.email,
      siteName: SITE_METADATA.title,
      locale: SITE_METADATA.locale,
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [withTrailingSlash(`${SITE_METADATA.siteUrl}/me`)],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@burakinc",
      title,
      description: post.excerpt,
      images: [
        `${SITE_METADATA.siteUrl}/assets/blog/og-images/${slug.replace(/-/g, "_")}.png`,
      ],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default PostPage;
