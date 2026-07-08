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
  const result = keyword
    ? await searchMovies(keyword, undefined, page)
    : { page: 1, pageCount: 1, total: 0, items: [] };

  return (
    <SiteShell>
      <section className="panel-raised mb-9 rounded-[var(--radius-lg)] p-6 md:p-8">
        <div className="hero-eyebrow">搜索</div>
        <h1 className="mt-5 text-3xl font-black md:text-5xl">
          {keyword ? `“${keyword}” 的搜索结果` : "搜索影视"}
        </h1>
        <p className="mt-4 max-w-[760px] text-sm leading-7 text-[var(--text-secondary)]">
          搜索直接走量子数据源，进入详情页后会再并行匹配其他允许线路，只展示真正有内容的播放源。
        </p>
        {keyword ? <p className="mt-3 text-sm text-[var(--text-tertiary)]">共找到 {result.total} 条相关内容</p> : null}
      </section>

      <MovieGrid movies={result.items} />
      {keyword ? (
        <Pagination
          page={result.page}
          pageCount={result.pageCount}
          href={(target) => `/search?q=${encodeURIComponent(keyword)}&page=${target}`}
        />
      ) : null}
    </SiteShell>
  );
}
