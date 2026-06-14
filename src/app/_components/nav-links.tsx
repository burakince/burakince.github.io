"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Latest Posts" },
  { href: "/tag/", label: "Tags" },
  { href: "/me/", label: "About" },
];

const NavLinks = () => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="flex gap-5">
      {NAV_ITEMS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`text-sm transition-colors ${
            isActive(href)
              ? "text-violet-200 dark:text-violet-400 font-semibold"
              : "text-slate-300 hover:text-violet-400 dark:text-slate-500 dark:hover:text-violet-400"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
