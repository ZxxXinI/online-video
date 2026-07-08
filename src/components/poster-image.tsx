"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export function PosterImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface-subtle)_92%,transparent),color-mix(in_srgb,var(--canvas)_76%,transparent))] p-4 text-center">
        <div>
          <div className="text-2xl font-black tracking-tight text-[var(--text-secondary)]">{alt.slice(0, 6)}</div>
          <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-tertiary)]">
            online cinema
          </div>
        </div>
      </div>
    );
  }

  // Remote poster hosts are dynamic, so native lazy loading is safer than an open image proxy.
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
