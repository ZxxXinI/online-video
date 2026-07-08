import { normalizeTitle } from "@/lib/content";
import type { SourceId } from "@/lib/types";

const PREFIX = "online-video";

export const cacheKeys = {
  homeHot: () => `${PREFIX}:home:hot`,
  homeCategory: (typeId: number) => `${PREFIX}:home:category:${typeId}`,
  resolveTitle: (title: string) => `${PREFIX}:resolve:title:${normalizeTitle(title)}`,
  detail: (sourceId: SourceId, movieId: string) => `${PREFIX}:detail:${sourceId}:${movieId}`,
};
