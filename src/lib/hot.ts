import * as cheerio from "cheerio";
import { isBlockedContent } from "@/lib/content";
import { listMovies } from "@/lib/mac-cms";
import type { HotRecommendation } from "@/lib/types";

const HOT_URL = "https://www.wfei.la/";

export function parseHotRecommendations(html: string): HotRecommendation[] {
  const $ = cheerio.load(html);
  const heading = $("h1.module-title").filter((_, element) =>
    $(element).text().includes("网飞啦热播"),
  );
  const hotSection = heading.closest(".module");

  return hotSection
    .find("a.module-poster-item")
    .map((index, element) => {
      const card = $(element);
      const image = card.find("img");
      const name = card.attr("title")?.trim() || image.attr("alt")?.trim() || "";
      return {
        id: `hot-${index}-${name}`,
        name,
        cover: image.attr("data-original")?.trim() || "",
        remarks: card.find(".module-item-note").text().trim(),
      };
    })
    .get()
    .filter((item) => item.name && !isBlockedContent(item.name))
    .slice(0, 12);
}

export async function getHotRecommendations() {
  try {
    const response = await fetch(HOT_URL, {
      headers: { "User-Agent": "Mozilla/5.0 OnlineCinema/1.0" },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`热播请求失败：${response.status}`);
    const items = parseHotRecommendations(await response.text());
    if (items.length > 0) return items;
  } catch {
    // Fall through to the stable MacCMS list.
  }

  const fallback = await listMovies();
  return fallback.items.slice(0, 12).map((movie) => ({
    id: `fallback-${movie.id}`,
    name: movie.name,
    cover: movie.cover,
    remarks: movie.remarks,
  }));
}
