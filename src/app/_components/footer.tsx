import { SITE_METADATA } from "@/lib/siteMetadata";
import SocialIcon from "./social-icons";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="border-t border-slate-400 flex flex-col items-center mt-12 py-6">
        <div className="mb-3 flex flex-row space-x-4">
          <SocialIcon kind="mail" href={`mailto:${SITE_METADATA.email}`} />
          <SocialIcon kind="github" href={SITE_METADATA.github} />
          <SocialIcon kind="linkedin" href={SITE_METADATA.linkedin} />
          <SocialIcon kind="twitter" href={SITE_METADATA.twitter} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{SITE_METADATA.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href="/">{SITE_METADATA.title}</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
