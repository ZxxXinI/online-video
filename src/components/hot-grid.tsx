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
      {notice ? (
        <div
          role="status"
          className="mb-5 rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium text-[var(--danger)]"
        >
          {notice}
        </div>
      ) : null}

      <div className="poster-grid">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openItem(item)}
            className="poster-card cursor-pointer border-0 bg-transparent p-0 text-left text-[var(--text)]"
            title={item.name}
          >
            <div className="poster-frame">
              <PosterImage src={item.cover} alt={item.name} />
              {item.remarks ? <span className="poster-remark">{item.remarks}</span> : null}
              {loadingId === item.id ? (
                <span className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 text-white">
                  <LoaderCircle className="animate-spin" aria-label="正在查询资源" />
                </span>
              ) : null}
            </div>
            <div className="poster-copy">
              <div className="poster-title">{item.name}</div>
              <div className="poster-meta-row">
                <span>热播排序参考</span>
                {item.remarks ? <span>{item.remarks}</span> : null}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
