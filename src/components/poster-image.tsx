"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";

export function PosterImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#e7ebef] p-3 text-center text-2xl font-bold text-[#7a8492]">
        {alt.slice(0, 6)}
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
