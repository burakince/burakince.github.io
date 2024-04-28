import { SITE_METADATA } from "@/lib/site-metadata";
import Link from "next/link";
import GithubIcon from "./social-icons/github.svg";
import GmailIcon from "./social-icons/gmail.svg";
import LinkedinIcon from "./social-icons/linkedin.svg";
import XIcon from "./social-icons/x.svg";
import KeybaseIcon from "./social-icons/keybase.svg";

const Footer = () => {
  return (
    <footer>
      <div className="border-t border-slate-400 flex flex-col items-center mt-12 py-6">
        <div className="mb-3 flex flex-row space-x-4">
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.github}
            title="github"
          >
            <span className="sr-only">github</span>
            <GithubIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-6" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.linkedin}
            title="linkedin"
          >
            <span className="sr-only">linkedin</span>
            <LinkedinIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-6" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.twitter}
            title="twitter"
          >
            <span className="sr-only">twitter</span>
            <XIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-6" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.keybase}
            title="keybase"
          >
            <span className="sr-only">keybase</span>
            <KeybaseIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-6" />
          </a>
          <a
            className="text-sm text-gray-500 transition hover:text-gray-600"
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${SITE_METADATA.email}`}
            title="email"
          >
            <span className="sr-only">mail</span>
            <GmailIcon className="fill-current text-gray-700 hover:text-primary-500 dark:text-gray-200 dark:hover:text-primary-400 size-6" />
          </a>
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
