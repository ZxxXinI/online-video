/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Play, Search } from "lucide-react";
import { HotGrid } from "@/components/hot-grid";
import { MovieGrid } from "@/components/movie-card";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { getHotRecommendations } from "@/lib/hot";
import { getCachedHomeCategory } from "@/lib/home-cache";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [hot, series, movies, anime, variety] = await Promise.all([
    getHotRecommendations(),
    safeList(2),
    safeList(1),
    safeList(4),
    safeList(3),
  ]);

  const heroItem = hot[0];

  return (
    <SiteShell>
      <section className="hero-panel mb-12 min-h-[420px] md:min-h-[500px]">
        {heroItem?.cover ? (
          <img
            src={heroItem.cover}
            alt={heroItem.name}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(83_177_255_/_14%),transparent_30%),linear-gradient(90deg,rgb(9_11_14_/_95%),rgb(9_11_14_/_78%)_45%,rgb(9_11_14_/_58%)_100%)]" />
        <div className="relative z-10 flex min-h-[420px] flex-col justify-end px-6 py-7 md:min-h-[500px] md:px-10 md:py-10">
          <div className="max-w-[680px] text-white">
            <div className="hero-eyebrow">在线影院热播</div>
            <h1 className="hero-title mt-5">今晚就看点真正值得点开的内容。</h1>
            <p className="mt-5 max-w-[620px] text-[15px] text-white/78 md:text-[16px]">
              首页热播来自公开站点排序参考，进入详情后会自动聚合多条 MacCMS 线路，只展示真正有内容的播放源。
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {heroItem ? (
                <Link href={`/search?q=${encodeURIComponent(heroItem.name)}`} className="button-primary">
                  <Play size={17} fill="currentColor" aria-hidden="true" />
                  立即查找热播
                </Link>
              ) : null}
              <Link href="/search" className="button-secondary">
                <Search size={17} aria-hidden="true" />
                搜索更多片名
              </Link>
            </div>
            {heroItem ? (
              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/78">
                <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                  当前热播：{heroItem.name}
                </span>
                {heroItem.remarks ? (
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                    {heroItem.remarks}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Section
        title="在线影院热播"
        description="按热度排序的片单入口，点击卡片后再按片名匹配真实资源站，避免首页等待过久。"
      >
        <HotGrid items={hot} />
      </Section>
      <Section title="剧集" description="默认更适合连续观看的内容。" moreHref="/category/2">
        <MovieGrid movies={series} />
      </Section>
      <Section title="电影" description="快速浏览近期可用电影资源。" moreHref="/category/1">
        <MovieGrid movies={movies} />
      </Section>
      <Section title="动漫" description="按量子数据源展示动漫资源。" moreHref="/category/4">
        <MovieGrid movies={anime} />
      </Section>
      <Section title="综艺" description="保留轻量信息密度，方便连续浏览。" moreHref="/category/3">
        <MovieGrid movies={variety} />
      </Section>
    </SiteShell>
  );
}

async function safeList(typeId: number) {
  try {
    return await getCachedHomeCategory(typeId);
  } catch {
    return [];
  }
}
