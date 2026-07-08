import type { Metadata } from "next";
import { Calendar, MapPin, Play, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { EpisodeSelector } from "@/components/episode-selector";
import { PosterImage } from "@/components/poster-image";
import { SiteShell } from "@/components/site-shell";
import { aggregateMovieDetail } from "@/lib/mac-cms";
import { getSource } from "@/lib/sources";
import type { SourceId } from "@/lib/types";

interface DetailPageProps {
  params: Promise<{ source: string; id: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { source, id } = await params;
  const definition = getSource(source);
  if (!definition) return { title: "影视详情" };

  const movie = await aggregateMovieDetail(definition.id, id);
  return movie ? { title: movie.name, description: movie.summary.slice(0, 150) } : { title: "影视详情" };
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { source, id } = await params;
  const definition = getSource(source);
  if (!definition) notFound();

  const movie = await aggregateMovieDetail(definition.id as SourceId, id);
  if (!movie) notFound();

  const firstPlayable = movie.playbackLines[0];

  return (
    <SiteShell>
      <article className="space-y-11">
        <section className="panel-raised rounded-[var(--radius-lg)] p-5 md:p-8">
          <div className="grid gap-7 md:grid-cols-[260px_minmax(0,1fr)] md:items-start">
            <div className="poster-frame mx-auto w-full max-w-[260px] md:mx-0">
              <PosterImage src={movie.cover} alt={movie.name} />
              {movie.score && Number(movie.score) > 0 ? <span className="poster-score">{movie.score}</span> : null}
              {movie.remarks ? <span className="poster-remark">{movie.remarks}</span> : null}
            </div>

            <div className="min-w-0">
              <div className="hero-eyebrow">{movie.typeName || "影视"}</div>
              <h1 className="mt-5 text-3xl font-black md:text-5xl">{movie.name}</h1>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[var(--text-secondary)]">
                {movie.year ? (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} aria-hidden="true" />
                    {movie.year}
                  </span>
                ) : null}
                {movie.area ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} aria-hidden="true" />
                    {movie.area}
                  </span>
                ) : null}
                {movie.actor ? (
                  <span className="flex items-center gap-1.5">
                    <UserRound size={15} aria-hidden="true" />
                    {movie.actor}
                  </span>
                ) : null}
              </div>

              <p className="mt-6 max-w-[760px] text-[15px] leading-8 text-[var(--text-secondary)]">
                {movie.summary || "暂无剧情简介。"}
              </p>

              <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                {movie.director ? (
                  <div className="panel rounded-[var(--radius-md)] px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">导演</dt>
                    <dd className="mt-2 text-[var(--text-secondary)]">{movie.director}</dd>
                  </div>
                ) : null}
                {movie.language ? (
                  <div className="panel rounded-[var(--radius-md)] px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">语言</dt>
                    <dd className="mt-2 text-[var(--text-secondary)]">{movie.language}</dd>
                  </div>
                ) : null}
                {movie.updatedAt ? (
                  <div className="panel rounded-[var(--radius-md)] px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">更新</dt>
                    <dd className="mt-2 text-[var(--text-secondary)]">{movie.updatedAt}</dd>
                  </div>
                ) : null}
                {movie.releaseDate ? (
                  <div className="panel rounded-[var(--radius-md)] px-4 py-3">
                    <dt className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">上映</dt>
                    <dd className="mt-2 text-[var(--text-secondary)]">{movie.releaseDate}</dd>
                  </div>
                ) : null}
              </dl>

              {firstPlayable ? (
                <a href={`/watch/${firstPlayable.sourceId}/${firstPlayable.movieId}/1`} className="button-primary mt-7">
                  <Play size={18} fill="currentColor" aria-hidden="true" />
                  立即播放
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section>
          <div className="section-divider" />
          <h2 className="text-[28px] font-black tracking-tight md:text-[32px]">播放线路与选集</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
            详情页按片名聚合多个数据源，只显示真实匹配到内容的线路。优先选择对应线路后再进入具体剧集。
          </p>
          <div className="mt-6">
            <EpisodeSelector lines={movie.playbackLines} />
          </div>
        </section>
      </article>
    </SiteShell>
  );
}
