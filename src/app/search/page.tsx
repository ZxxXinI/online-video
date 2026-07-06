import type { Metadata } from "next";
import { MovieGrid } from "@/components/movie-card";
import { Pagination } from "@/components/pagination";
import { SiteShell } from "@/components/site-shell";
import { searchMovies } from "@/lib/mac-cms";

export const metadata: Metadata = { title: "搜索" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const query = await searchParams;
  const keyword = query.q?.trim() ?? "";
  const page = Math.max(1, Number(query.page) || 1);
  const result = keyword ? await searchMovies(keyword, undefined, page) : { page: 1, pageCount: 1, total: 0, items: [] };

  return (
    <SiteShell>
      <div className="mb-7 border-b border-[#e2e7ec] pb-6">
        <p className="mb-1 text-xs font-semibold uppercase text-[#ef3340]">Search</p>
        <h1 className="text-3xl font-black">{keyword ? `“${keyword}”的搜索结果` : "搜索影视"}</h1>
        {keyword && <p className="mt-2 text-sm text-[#697386]">共找到 {result.total} 条相关内容</p>}
      </div>
      <MovieGrid movies={result.items} />
      {keyword && <Pagination page={result.page} pageCount={result.pageCount} href={(target) => `/search?q=${encodeURIComponent(keyword)}&page=${target}`} />}
    </SiteShell>
  );
}
