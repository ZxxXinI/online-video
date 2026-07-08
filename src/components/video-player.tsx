"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { MovieDetail, PlaybackLine } from "@/lib/types";

export function VideoPlayer({
  movie,
  selectedLine,
  episodeIndex,
}: {
  movie: MovieDetail;
  selectedLine: PlaybackLine;
  episodeIndex: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const episode = selectedLine.episodes[episodeIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !episode) return;

    setError("");
    let hls: Hls | null = null;

    if (Hls.isSupported() && /\.m3u8(?:$|\?)/i.test(episode.url)) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(episode.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) setError("当前线路加载失败，请重试或切换线路");
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl") || !/\.m3u8(?:$|\?)/i.test(episode.url)) {
      video.src = episode.url;
    } else {
      setError("当前浏览器不支持该视频格式");
    }

    const onError = () => setError("视频无法播放，可能是地址失效或存在跨域限制，请切换线路");
    video.addEventListener("error", onError);

    return () => {
      video.removeEventListener("error", onError);
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [episode]);

  if (!episode) {
    return <div className="panel-raised rounded-[var(--radius-lg)] p-8 text-center text-sm text-[var(--text-secondary)]">未找到对应剧集</div>;
  }

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[#0b0e12] shadow-[var(--shadow-lg)]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative flex min-h-[240px] items-center bg-black sm:min-h-[420px] lg:min-h-[600px]">
          <video
            ref={videoRef}
            controls
            playsInline
            className="h-full max-h-[75vh] w-full bg-black"
            aria-label={`${movie.name} ${episode.name}`}
          />
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/86 p-6 text-center text-white">
              <AlertCircle size={38} className="text-[var(--danger)]" aria-hidden="true" />
              <p className="max-w-md text-sm leading-7">{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="button-primary">
                <RotateCcw size={16} aria-hidden="true" />
                重试
              </button>
            </div>
          ) : null}
        </div>

        <aside className="border-l border-white/8 bg-[linear-gradient(180deg,#12161c,#0f1318)] text-white">
          <div className="border-b border-white/8 p-5">
            <div className="hero-eyebrow">正在播放</div>
            <h1 className="mt-4 text-2xl font-black">{movie.name}</h1>
            <p className="mt-2 text-sm text-white/80">{episode.name}</p>
            <p className="mt-3 text-xs leading-6 text-white/55">
              当前线路：{selectedLine.sourceName} / {selectedLine.playFrom}
            </p>
          </div>

          <div className="scroll-row flex gap-2 overflow-x-auto border-b border-white/8 p-4">
            {movie.playbackLines.map((line) => {
              const target = Math.min(episodeIndex, line.episodes.length - 1) + 1;
              return (
                <Link
                  key={line.id}
                  href={`/watch/${line.sourceId}/${line.movieId}/${target}`}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    line.sourceId === selectedLine.sourceId
                      ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--accent-soft)] text-white"
                      : "border-white/10 bg-white/[0.05] text-white/70 hover:text-white"
                  }`}
                >
                  {line.sourceName}
                </Link>
              );
            })}
          </div>

          <div className="grid max-h-[430px] grid-cols-2 gap-2 overflow-y-auto p-4">
            {selectedLine.episodes.map((item, index) => (
              <Link
                key={`${item.name}-${index}`}
                href={`/watch/${selectedLine.sourceId}/${selectedLine.movieId}/${index + 1}`}
                className={`rounded-[var(--radius-md)] border px-3 py-2.5 text-center text-sm font-medium transition-colors ${
                  index === episodeIndex
                    ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--accent-soft)] text-white"
                    : "border-white/8 bg-white/[0.04] text-white/75 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
