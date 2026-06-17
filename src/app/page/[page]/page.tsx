import { getAllPosts } from "@/lib/api";
import { calcTotalPages, paginateSlice } from "@/lib/pagination";
import PostPreview from "@/app/_components/post-preview";
import Pagination from "@/app/_components/pagination";
import { SITE_METADATA } from "@/lib/site-metadata";
import { withTrailingSlash } from "@/lib/url";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbList, WithContext } from "schema-dts";
import JsonLd from "@/app/_components/json-ld";

const POSTS_PER_PAGE = 4;

type Params = Promise<{ page: string }>;

export async function generateStaticParams() {
  const allPosts = getAllPosts();
  const totalPages = calcTotalPages(allPosts.length, POSTS_PER_PAGE);
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const title = `Page ${pageNum} | ${SITE_METADATA.title}`;
  return {
    title,
    alternates: {
      canonical: withTrailingSlash(`${SITE_METADATA.siteUrl}/page/${pageNum}`),
    },
  };
}

const PaginatedPage = async ({ params }: { params: Params }) => {
  const { page } = await params;
  const pageNum = parseInt(page, 10);
  const allPosts = getAllPosts();
  const totalPages = calcTotalPages(allPosts.length, POSTS_PER_PAGE);

  if (isNaN(pageNum) || pageNum < 2 || pageNum > totalPages) {
    return notFound();
  }

  const posts = paginateSlice(allPosts, pageNum, POSTS_PER_PAGE);

  const pageUrl = withTrailingSlash(`${SITE_METADATA.siteUrl}/page/${pageNum}`);
  const breadcrumbData: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    name: `Page ${pageNum}`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: { "@type": "WebPage", "@id": withTrailingSlash(SITE_METADATA.siteUrl), name: "Home" },
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Page ${pageNum}`,
        item: { "@type": "WebPage", "@id": pageUrl, name: `Page ${pageNum}` },
      },
    ],
  };

  return (
    <div>
      <JsonLd data={breadcrumbData} />
      <h1 className="text-2xl font-bold mb-4 dark:text-gray-300">
        Latest Posts
      </h1>
      <div className={`grid gap-4 ${posts.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
        {posts.map((post) => (
          <PostPreview key={post.slug} {...post} />
        ))}
      </div>
      <Pagination currentPage={pageNum} totalPages={totalPages} totalPosts={allPosts.length} />
    </div>
  );
};

export default PaginatedPage;
