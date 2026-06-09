import { SITE_METADATA } from "@/lib/site-metadata";
import Link from "next/link";
import NavLinks from "@/app/_components/nav-links";

const Header = () => {
  return (
    <header>
      <div className="bg-slate-800 dark:bg-slate-950 px-8 py-5 my-6 rounded-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href={"/"}>
          <p className="text-xl text-white dark:text-slate-500 font-bold leading-tight">
            {SITE_METADATA.title}
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-600 mt-0.5">
            {SITE_METADATA.jobTitle} at {SITE_METADATA.worksFor.name}{" "}&middot;{" "}Cloud-native engineering, AI &amp; software craftsmanship.
          </p>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
};

export default Header;
