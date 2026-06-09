import { OgImage } from "@/interfaces/og-template";
import { SITE_METADATA } from "@/lib/site-metadata";
import { smartTruncate } from "@/lib/truncate";

const OgTemplate = ({
  title,
  excerpt,
  siteTitle = SITE_METADATA.siteUrl,
}: OgImage) => {
  const truncatedExcerpt = smartTruncate(excerpt);

  return (
    <div tw="flex flex-col w-full h-full justify-center bg-slate-100 px-8">
      <div tw="bg-slate-300 flex flex-col w-full py-12 px-8">
        <span tw="text-3xl font-bold tracking-tight text-gray-900">
          {title}
        </span>
        <span tw="text-2xl text-indigo-600 mt-4">{truncatedExcerpt}</span>
      </div>
    </div>
  );
};

export default OgTemplate;
