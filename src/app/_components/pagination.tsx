import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  totalPosts?: number;
};

const Pagination = ({ currentPage, totalPages, totalPosts }: Props) => {
  const prevHref =
    currentPage === 2 ? "/" : `/page/${currentPage - 1}/`;
  const nextHref = `/page/${currentPage + 1}/`;

  const baseBtn =
    "px-4 py-2 rounded-md text-sm font-medium border transition-colors";
  const activeBtn = `${baseBtn} border-violet-400 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800`;
  const disabledBtn = `${baseBtn} border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-400 cursor-default`;

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-4 mt-8"
    >
      {currentPage > 1 ? (
        <Link href={prevHref} className={activeBtn}>
          ← Prev
        </Link>
      ) : (
        <span className={disabledBtn}>← Prev</span>
      )}

      <span className="text-sm text-slate-700 dark:text-slate-400">
        Page {currentPage} of {totalPages}
        {totalPosts !== undefined && ` · ${totalPosts} posts`}
      </span>

      {currentPage < totalPages ? (
        <Link href={nextHref} className={activeBtn}>
          Next →
        </Link>
      ) : (
        <span className={disabledBtn}>Next →</span>
      )}
    </nav>
  );
};

export default Pagination;
