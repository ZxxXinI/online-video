import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MovieGrid } from "@/components/movie-card";
import { Section } from "@/components/section";
import { SiteShell } from "@/components/site-shell";
import { VideoPlayer } from "@/components/video-player";
import { aggregateMovieDetail, listCategoryMovies } from "@/lib/mac-cms";
import { getSource } from "@/lib/sources";

interface WatchPageProps { params: Promise<{ source: string; id: string; episode: string }> }

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
  const recommendations = (await listCategoryMovies(movie.typeName.includes("动漫") ? 4 : movie.typeName.includes("电影") ? 1 : 2)).items.slice(0, 12);

  return (
    <SiteShell>
      <VideoPlayer movie={movie} selectedLine={line} episodeIndex={episodeIndex} />
      <div className="mt-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">{movie.name}</h1>
          <p className="mt-1 text-sm text-[#697386]">{line.episodes[episodeIndex].name} · {line.sourceName}</p>
        </div>
        <a href={`/video/${movie.sourceId}/${movie.id}`} className="shrink-0 rounded-md border border-[#d9dfe5] bg-white px-4 py-2 text-sm hover:border-[#f04444] hover:text-[#ef3340]">返回详情</a>
      </div>
      <div className="mt-11"><Section title="同类推荐"><MovieGrid movies={recommendations} /></Section></div>
    </SiteShell>
  );
}
