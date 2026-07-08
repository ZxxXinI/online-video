"use client";

import Link from "next/link";
import { useState } from "react";
import type { PlaybackLine } from "@/lib/types";

export function EpisodeSelector({ lines }: { lines: PlaybackLine[] }) {
  const [selected, setSelected] = useState(0);
  const line = lines[selected];

  if (!line) {
    return <div className="empty-panel text-sm">暂无可播放线路</div>;
  }

  return (
    <div className="panel-raised rounded-[var(--radius-lg)] p-5 md:p-6">
      <div className="scroll-row mb-5 flex flex-wrap gap-2" role="tablist" aria-label="播放线路">
        {lines.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={selected === index}
            onClick={() => setSelected(index)}
            className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              selected === index
                ? "border-[color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[var(--accent-soft)] text-[var(--text)]"
                : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)]"
            }`}
          >
            {item.sourceName}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[var(--text-tertiary)]">
        <span className="rounded-full border border-[var(--border)] px-3 py-1.5">{line.playFrom}</span>
        <span>共 {line.episodes.length} 集</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
        {line.episodes.map((episode, index) => (
          <Link
            key={`${episode.name}-${index}`}
            href={`/watch/${line.sourceId}/${line.movieId}/${index + 1}`}
            className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] px-3 py-2 text-center text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[color-mix(in_srgb,var(--accent)_24%,var(--border-strong))] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {episode.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
