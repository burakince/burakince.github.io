import { SITE_METADATA } from "@/lib/site-metadata";
import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="text-center bg-slate-800 dark:bg-slate-950 p-8 my-6 rounded-md">
        <Link href={"/"}>
          <p className="text-2xl text-white dark:text-slate-500 font-bold mt-4">
            {SITE_METADATA.title}
          </p>
        </Link>
        <p className="text-slate-300 dark:text-slate-700">
          🤟 Welcome to my tech blog. 💻
        </p>
      </div>
    </header>
  );
};

export default Header;
