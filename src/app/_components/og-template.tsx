import { OgImage } from "@/interfaces/og-template";
import { SITE_METADATA } from "@/lib/site-metadata";

const OgTemplate = ({
  title,
  excerpt,
  siteTitle = SITE_METADATA.siteUrl,
}: OgImage) => {
  return (
    <div tw="flex flex-col w-full h-full items-center justify-center bg-slate-100">
      <div tw="bg-slate-300 flex mx-5">
        <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
          <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
            <span>{title}</span>
            <span tw="text-indigo-600 mt-3">{excerpt.slice(0, 140)}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default OgTemplate;
