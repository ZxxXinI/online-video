import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MovieGrid } from "@/components/movie-card";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { aggregateMovieDetail, listCategoryMovies } from "@/lib/mac-cms";
import { getSource } from "@/lib/sources";

interface WatchPageProps {
  params: Promise<{ source: string; id: string; episode: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { source, id, episode } = await params;
  const definition = getSource(source);
  if (!definition) return { title: "在线播放" };

  const movie = await aggregateMovieDetail(definition.id, id);
  const line = movie?.playbackLines.find((item) => item.sourceId === definition.id);
  const item = line?.episodes[Math.max(0, Number(episode) - 1)];
  return { title: movie && item ? `${movie.name} ${item.name}` : "在线播放" };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { source, id, episode } = await params;
  const definition = getSource(source);
  if (!definition) notFound();

  const movie = await aggregateMovieDetail(definition.id, id);
  if (!movie) notFound();

  const line = movie.playbackLines.find((item) => item.sourceId === definition.id);
  const episodeIndex = Number(episode) - 1;
  if (!line || !Number.isInteger(episodeIndex) || episodeIndex < 0 || episodeIndex >= line.episodes.length) notFound();

  const recommendations = (
    await listCategoryMovies(movie.typeName.includes("动漫") ? 4 : movie.typeName.includes("电影") ? 1 : 2)
  ).items.slice(0, 12);

  return (
    <SiteShell>
      <VideoPlayer movie={movie} selectedLine={line} episodeIndex={episodeIndex} />

      <section className="panel-raised mt-8 rounded-[var(--radius-lg)] p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="hero-eyebrow">播放信息</div>
            <h1 className="mt-4 text-2xl font-black md:text-4xl">{movie.name}</h1>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              当前剧集：{line.episodes[episodeIndex].name} · 当前线路：{line.sourceName}
            </p>
          </div>
          <Link href={`/video/${movie.sourceId}/${movie.id}`} className="button-secondary shrink-0">
            <ArrowLeft size={16} aria-hidden="true" />
            返回详情
          </Link>
        </div>
      </section>

      <div className="mt-11">
        <Section title="同类推荐" description="继续浏览同类型内容，减少返回首页反复筛选的成本。">
          <MovieGrid movies={recommendations} />
        </Section>
      </div>
    </SiteShell>
  );
}
