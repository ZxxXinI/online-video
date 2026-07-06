"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlaybackLine } from "@/lib/types";

export function EpisodeSelector({ lines }: { lines: PlaybackLine[] }) {
  const [selected, setSelected] = useState(0);
  const line = lines[selected];
  if (!line) return <div className="text-sm text-[#697386]">暂无可播放线路</div>;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="播放线路">
        {lines.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            onClick={() => setSelected(index)}
            className={`rounded-md border px-4 py-2 text-sm font-semibold ${selected === index ? "border-[#f04444] bg-[#f04444] text-white" : "border-[#dde2e7] bg-white hover:border-[#f04444] hover:text-[#ef3340]"}`}
          >
            {item.sourceName}
          </button>
        ))}
      </div>
      <div className="mb-3 text-xs text-[#8a93a0]">{line.playFrom} · 共 {line.episodes.length} 集</div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {line.episodes.map((episode, index) => (
          <Link
            key={`${episode.name}-${index}`}
            href={`/watch/${line.sourceId}/${line.movieId}/${index + 1}`}
            className="flex min-h-11 items-center justify-center rounded-md border border-[#e0e5ea] bg-white px-2 py-2 text-center text-sm hover:border-[#f04444] hover:text-[#ef3340]"
          >
            {episode.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
