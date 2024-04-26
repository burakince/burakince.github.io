import DateFormatter from "@/app/_components/date-formatter";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import markdownToHtml from "@/lib/markdownToHtml";
import { SITE_METADATA } from "@/lib/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import hljs from "highlight.js";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("yaml", yaml);

type Params = {
  params: {
    slug: string;
  };
};

const PostPage = async ({ params }: Params) => {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <div>
      <div className="my-12 text-center">
        <h1 className="text-2xl text-violet-600 dark:text-violet-500 mb-2">
          {post.title}
        </h1>
        <DateFormatter dateString={post.date} />
      </div>
      <article className="prose dark:prose-invert max-w-none lg:prose-xl">
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  );
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | Burak Ince`;

  return {
    title,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: `${SITE_METADATA.siteUrl}/post/${params.slug}`,
    },
    openGraph: {
      title,
      description: post.excerpt,
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
