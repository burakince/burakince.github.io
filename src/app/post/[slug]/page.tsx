import DateFormatter from "@/app/_components/date-formatter";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPosting, Organization, Person, WithContext } from "schema-dts";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import yaml from "highlight.js/lib/languages/yaml";
import JsonLd from "@/app/_components/json-ld";
import { Params } from "@/interfaces/post";
import { generateImage } from "@/lib/og-generator";
import OgTemplate from "@/app/_components/og-template";
import Image from "next/image";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("yaml", yaml);

const orgJsonLd: Organization = {
  "@type": "Organization",
  name: SITE_METADATA.worksFor.name,
  url: SITE_METADATA.worksFor.url,
  logo: SITE_METADATA.worksFor.logo,
};

const imageSize = {
  width: 1200,
  height: 630,
};

const meJsonLd: Person = {
  "@type": "Person",
  name: SITE_METADATA.author,
  jobTitle: SITE_METADATA.jobTitle,
  worksFor: orgJsonLd,
  url: `${SITE_METADATA.siteUrl}/me`,
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
    dateModified: new Date().toISOString(),
    inLanguage: SITE_METADATA.locale,
    isFamilyFriendly: true,
    accountablePerson: meJsonLd,
    author: meJsonLd,
    creator: meJsonLd,
    publisher: meJsonLd,
    description: post.excerpt,
  };

  const content = await markdownToHtml(post.content || "");

  return (
    <div>
      <div className="my-6 text-center">
        <div className="flex justify-center items-center">
          <Image
            src={ogImage}
            width={imageSize.width / 1.4}
            height={imageSize.height / 1.4}
            alt={post.title}
            priority={true}
          />
        </div>
        <h2 className="text-2xl text-violet-600 dark:text-violet-500 mt-6 mb-2">
          {post.title}
        </h2>
        <DateFormatter dateString={post.date} />
      </div>
      <article className="prose dark:prose-invert max-w-none lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
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
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_METADATA.siteUrl}/post/${slug}/`,
    },
    openGraph: {
      type: "article",
      images: [
        `${SITE_METADATA.siteUrl}/assets/blog/og-images/${slug.replace(/-/g, "_")}.png`,
      ],
      url: `${SITE_METADATA.siteUrl}/post/${slug}/`,
      title,
      description: post.excerpt,
      emails: SITE_METADATA.email,
      siteName: post.excerpt,
      locale: SITE_METADATA.locale,
      publishedTime: post.date,
      modifiedTime: new Date().toISOString(),
      authors: `${SITE_METADATA.siteUrl}/me/`,
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      creator: "@burakinc",
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
