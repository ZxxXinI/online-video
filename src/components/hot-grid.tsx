"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { PosterImage } from "@/components/poster-image";
import type { HotRecommendation } from "@/lib/types";

export function HotGrid({ items }: { items: HotRecommendation[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  async function openItem(item: HotRecommendation) {
    setLoadingId(item.id);
    setNotice("");
    try {
      const response = await fetch(`/api/resolve?q=${encodeURIComponent(item.name)}`);
      const result = (await response.json()) as { found: boolean; href?: string };
      if (result.found && result.href) {
        router.push(result.href);
      } else {
        setNotice(`暂无《${item.name}》的视频资源`);
      }
    } catch {
      setNotice("查询资源失败，请稍后重试");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      {notice && (
        <div role="status" className="mb-4 rounded-md border border-[#ffc9c9] bg-[#fff1f1] px-4 py-3 text-sm text-[#c62835]">
          {notice}
        </div>
      )}
      <div className="poster-grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openItem(item)}
            className="poster-card cursor-pointer border-0 bg-transparent p-0 text-left"
            title={item.name}
          >
            <div className="poster-frame">
              <PosterImage src={item.cover} alt={item.name} />
              {item.remarks && <span className="poster-remark">{item.remarks}</span>}
              {loadingId === item.id && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white">
                  <LoaderCircle className="animate-spin" aria-label="正在查询资源" />
                </span>
              )}
            </div>
            <div className="poster-title">{item.name}</div>
          </button>
        ))}
      </div>
    </>
  );
}
