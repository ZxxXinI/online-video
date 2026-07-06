import Link from "next/link";

export function Pagination({ page, pageCount, href }: { page: number; pageCount: number; href: (page: number) => string }) {
  if (pageCount <= 1) return null;
  return (
    <nav className="mt-10 flex items-center justify-center gap-3" aria-label="分页">
      <PageLink disabled={page <= 1} href={href(page - 1)}>上一页</PageLink>
      <span className="px-3 text-sm text-[#697386]">{page} / {pageCount}</span>
      <PageLink disabled={page >= pageCount} href={href(page + 1)}>下一页</PageLink>
    </nav>
  );
}

function PageLink({ disabled, href, children }: { disabled: boolean; href: string; children: React.ReactNode }) {
  if (disabled) return <span className="rounded-md border border-[#e2e7ec] px-4 py-2 text-sm text-[#a6adb7]">{children}</span>;
  return <Link href={href} className="rounded-md border border-[#d9dfe5] bg-white px-4 py-2 text-sm hover:border-[#f04444] hover:text-[#ef3340]">{children}</Link>;
}
