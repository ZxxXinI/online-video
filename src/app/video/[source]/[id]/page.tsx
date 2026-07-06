import type { Metadata } from "next";
import { Calendar, MapPin, Play, UserRound } from "lucide-react";
import { notFound } from "next/navigation";
import { EpisodeSelector } from "@/components/episode-selector";
import { PosterImage } from "@/components/poster-image";
import { SiteShell } from "@/components/site-shell";
import { aggregateMovieDetail } from "@/lib/mac-cms";
import { getSource } from "@/lib/sources";
import type { SourceId } from "@/lib/types";

interface DetailPageProps { params: Promise<{ source: string; id: string }> }

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

  return (
    <SiteShell>
      <article>
        <section className="grid gap-7 rounded-lg border border-[#e2e7ec] bg-white p-5 shadow-sm md:grid-cols-[210px_minmax(0,1fr)] md:p-7">
          <div className="poster-frame mx-auto w-full max-w-[230px] md:mx-0">
            <PosterImage src={movie.cover} alt={movie.name} />
          </div>
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#f04444] px-2 py-1 text-xs font-bold text-white">{movie.typeName || "影视"}</span>
              {movie.score && <span className="text-sm font-bold text-[#ef3340]">{movie.score} 分</span>}
            </div>
            <h1 className="text-3xl font-black md:text-4xl">{movie.name}</h1>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#697386]">
              {movie.year && <span className="flex items-center gap-1.5"><Calendar size={15} />{movie.year}</span>}
              {movie.area && <span className="flex items-center gap-1.5"><MapPin size={15} />{movie.area}</span>}
              {movie.actor && <span className="flex items-center gap-1.5"><UserRound size={15} />{movie.actor}</span>}
            </div>
            <p className="mt-5 line-clamp-5 text-[15px] leading-7 text-[#4d5868]">{movie.summary || "暂无剧情简介。"}</p>
            <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
              {movie.director && <div><dt className="inline font-semibold">导演：</dt><dd className="inline text-[#697386]">{movie.director}</dd></div>}
              {movie.language && <div><dt className="inline font-semibold">语言：</dt><dd className="inline text-[#697386]">{movie.language}</dd></div>}
              {movie.updatedAt && <div><dt className="inline font-semibold">更新：</dt><dd className="inline text-[#697386]">{movie.updatedAt}</dd></div>}
            </dl>
            {movie.playbackLines[0] && (
              <a href={`/watch/${movie.playbackLines[0].sourceId}/${movie.playbackLines[0].movieId}/1`} className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#f04444] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 hover:bg-[#e32636]">
                <Play size={18} fill="currentColor" /> 立即播放
              </a>
            )}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-black">播放线路与选集</h2>
          <EpisodeSelector lines={movie.playbackLines} />
        </section>
      </article>
    </SiteShell>
  );
}
