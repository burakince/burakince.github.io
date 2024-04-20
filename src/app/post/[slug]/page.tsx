import DateFormatter from "@/app/_components/date-formatter";
import { getAllPosts, getPostBySlug } from "@/lib/api";
import { SITE_METADATA } from "@/lib/siteMetadata";
import Markdown from "markdown-to-jsx";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

const PostPage = ({ params }: Params) => {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <div>
      <div className="my-12 text-center">
        <h1 className="text-2xl text-violet-600 dark:text-violet-500 mb-2">
          {post.title}
        </h1>
        <DateFormatter dateString={post.date} />
      </div>
      <article className="prose dark:prose-invert max-w-none lg:prose-xl">
        <Markdown>{post.content || ""}</Markdown>
      </article>
    </div>
  );
};

export function generateMetadata({ params }: Params): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | ${SITE_METADATA.title}`;

  return {
    title,
    openGraph: {
      title,
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
