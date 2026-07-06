"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import type { MovieDetail, PlaybackLine } from "@/lib/types";

export function VideoPlayer({ movie, selectedLine, episodeIndex }: { movie: MovieDetail; selectedLine: PlaybackLine; episodeIndex: number }) {
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
      setError("当前浏览器不支持此视频格式");
    }

    const onError = () => setError("视频无法播放，可能是地址失效或跨域限制，请切换线路");
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("error", onError);
      hls?.destroy();
      video.removeAttribute("src");
      video.load();
    };
  }, [episode]);

  if (!episode) return <div className="p-8 text-white">未找到对应剧集</div>;

  return (
    <div className="overflow-hidden rounded-lg bg-[#11151b] shadow-xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="relative flex min-h-[230px] items-center bg-black sm:min-h-[420px] lg:min-h-[560px]">
          <video ref={videoRef} controls playsInline className="h-full max-h-[72vh] w-full bg-black" aria-label={`${movie.name} ${episode.name}`} />
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 p-6 text-center text-white">
              <AlertCircle size={36} className="text-[#ff5b62]" aria-hidden="true" />
              <p className="max-w-md text-sm">{error}</p>
              <button type="button" onClick={() => window.location.reload()} className="flex items-center gap-2 rounded-md bg-[#f04444] px-4 py-2 text-sm font-semibold">
                <RotateCcw size={16} aria-hidden="true" /> 重试
              </button>
            </div>
          )}
        </div>
        <aside className="border-l border-white/10 bg-[#1a2029] text-white">
          <div className="border-b border-white/10 p-5">
            <h1 className="text-xl font-bold">{movie.name} · {episode.name}</h1>
            <p className="mt-2 text-xs text-white/55">当前线路：{selectedLine.sourceName} / {selectedLine.playFrom}</p>
          </div>
          <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-3">
            {movie.playbackLines.map((line) => {
              const target = Math.min(episodeIndex, line.episodes.length - 1) + 1;
              return (
                <Link key={line.id} href={`/watch/${line.sourceId}/${line.movieId}/${target}`} className={`shrink-0 rounded px-3 py-2 text-sm ${line.sourceId === selectedLine.sourceId ? "bg-[#f04444]" : "bg-white/8 hover:bg-white/15"}`}>
                  {line.sourceName}
                </Link>
              );
            })}
          </div>
          <div className="grid max-h-[410px] grid-cols-2 gap-2 overflow-y-auto p-3">
            {selectedLine.episodes.map((item, index) => (
              <Link key={`${item.name}-${index}`} href={`/watch/${selectedLine.sourceId}/${selectedLine.movieId}/${index + 1}`} className={`rounded px-3 py-2 text-center text-sm ${index === episodeIndex ? "bg-[#f04444]" : "bg-white/6 hover:bg-white/12"}`}>
                {item.name}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
