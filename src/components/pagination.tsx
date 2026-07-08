import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  href,
}: {
  page: number;
  pageCount: number;
  href: (page: number) => string;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav className="mt-11 flex items-center justify-center gap-3" aria-label="分页">
      <PageLink disabled={page <= 1} href={href(page - 1)}>
        上一页
      </PageLink>
      <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
        {page} / {pageCount}
      </span>
      <PageLink disabled={page >= pageCount} href={href(page + 1)}>
        下一页
      </PageLink>
    </nav>
  );
}

function PageLink({ disabled, href, children }: { disabled: boolean; href: string; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-tertiary)]">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className="button-secondary min-h-0 px-4 py-2 text-sm">
      {children}
    </Link>
  );
}
