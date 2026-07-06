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
      <div className="mb-7 flex flex-col gap-4 border-b border-[#e2e7ec] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-[#ef3340]">Category</p>
          <h1 className="text-3xl font-black">{current.name}</h1>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <Link key={filter.id} href={`/category/${filter.id}`} className={`shrink-0 rounded-md px-3 py-2 text-sm ${filter.id === id ? "bg-[#f04444] font-semibold text-white" : "border border-[#dde2e7] bg-white hover:border-[#f04444]"}`}>
              {filter.name}
            </Link>
          ))}
        </div>
      </div>
      <MovieGrid movies={result.items} />
      <Pagination page={result.page} pageCount={result.pageCount} href={(target) => `/category/${id}?page=${target}`} />
    </SiteShell>
  );
}
