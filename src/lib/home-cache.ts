import { getOrSetJsonCache } from "@/lib/cache/json-cache";
import { cacheKeys } from "@/lib/cache/keys";
import { longContentTtl } from "@/lib/cache/ttl";
import { listCategoryMovies } from "@/lib/mac-cms";
import type { MovieSummary } from "@/lib/types";

export function getCachedHomeCategory(typeId: number): Promise<MovieSummary[]> {
  return getOrSetJsonCache(cacheKeys.homeCategory(typeId), longContentTtl(), async () => {
    const result = await listCategoryMovies(typeId);
    return result.items.slice(0, 12);
  });
}
