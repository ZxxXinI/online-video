import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovieGrid } from "@/components/movie-card";
import { Pagination } from "@/components/pagination";
import { SiteShell } from "@/components/site-shell";
import { getCategories, listCategoryMovies } from "@/lib/mac-cms";

interface CategoryPageProps {
  params: Promise<{ typeId: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { typeId } = await params;
  const categories = await getCategories();
  const category = categories.find((item) => item.id === Number(typeId));
  return { title: category?.name ?? "影视分类" };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ typeId }, query] = await Promise.all([params, searchParams]);
  const id = Number(typeId);
  if (!Number.isInteger(id)) notFound();

  const page = Math.max(1, Number(query.page) || 1);
  const [categories, result] = await Promise.all([getCategories(), listCategoryMovies(id, page)]);
  const current = categories.find((item) => item.id === id);
  if (!current) notFound();
  const parentId = current.parentId || current.id;
  const filters = categories.filter((item) => item.id === parentId || item.parentId === parentId);

  return (
    <SiteShell>
      <section className="panel-raised mb-9 rounded-[var(--radius-lg)] p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[640px]">
            <div className="hero-eyebrow">分类频道</div>
            <h1 className="mt-5 text-3xl font-black md:text-5xl">{current.name}</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
              该页面按 MacCMS 分类拉取内容。一级分类会聚合同级子分类内容，方便在同一频道下连续浏览。
            </p>
          </div>
          <div className="text-sm text-[var(--text-tertiary)]">
            当前第 {result.page} / {result.pageCount} 页
          </div>
        </div>
        <div className="scroll-row mt-6 flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <Link
              key={filter.id}
              href={`/category/${filter.id}`}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                filter.id === id
                  ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--accent-soft)] text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              {filter.name}
            </Link>
          ))}
        </div>
      </section>
      <MovieGrid movies={result.items} />
      <Pagination page={result.page} pageCount={result.pageCount} href={(target) => `/category/${id}?page=${target}`} />
    </SiteShell>
  );
}
