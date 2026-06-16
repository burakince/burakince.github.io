import { SITE_METADATA } from "@/lib/site-metadata";
import Link from "next/link";
import GithubIcon from "./social-icons/github.svg";
import GmailIcon from "./social-icons/gmail.svg";
import LinkedinIcon from "./social-icons/linkedin.svg";
import XIcon from "./social-icons/x.svg";
import KeybaseIcon from "./social-icons/keybase.svg";
import HuggingfaceIcon from "./social-icons/huggingface.svg";
import BlueskyIcon from "./social-icons/bluesky.svg";

const Footer = () => {
  return (
    <footer>
      <div className="border-t border-slate-400 flex flex-col items-center mt-12 py-6">
        <div className="mb-3 flex flex-row space-x-4">
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.github}
            title="github"
          >
            <span className="sr-only">github (opens in a new tab)</span>
            <GithubIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.linkedin}
            title="linkedin"
          >
            <span className="sr-only">linkedin (opens in a new tab)</span>
            <LinkedinIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.twitter}
            title="twitter"
          >
            <span className="sr-only">twitter (opens in a new tab)</span>
            <XIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.bluesky}
            title="bluesky"
          >
            <span className="sr-only">bluesky (opens in a new tab)</span>
            <BlueskyIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.keybase}
            title="keybase"
          >
            <span className="sr-only">keybase (opens in a new tab)</span>
            <KeybaseIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={SITE_METADATA.huggingface}
            title="huggingface"
          >
            <span className="sr-only">huggingface (opens in a new tab)</span>
            <HuggingfaceIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
          <a
            className="group transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            href={`mailto:${SITE_METADATA.email}`}
            title="email"
          >
            <span className="sr-only">mail (opens in a new tab)</span>
            <GmailIcon aria-hidden={true} className="fill-current text-slate-700 dark:text-slate-200 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition-colors size-6" />
          </a>
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-slate-700 dark:text-slate-300">
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
