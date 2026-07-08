import { z } from "zod";
import { getJsonCache, setJsonCache } from "@/lib/cache/json-cache";
import { cacheKeys } from "@/lib/cache/keys";
import { longContentTtl, shortMissTtl } from "@/lib/cache/ttl";
import { cleanHtml, isBlockedCategory, isBlockedContent, normalizeTitle } from "@/lib/content";
import { parsePlaybackGroups, selectPreferredGroup } from "@/lib/playback";
import { DEFAULT_SOURCE_ID, getSource, SOURCES } from "@/lib/sources";
import type {
  Category,
  MovieDetail,
  MoviePage,
  MovieSummary,
  PlaybackLine,
  SourceDefinition,
  SourceId,
} from "@/lib/types";

const text = z.preprocess((value) => (value == null ? "" : String(value)), z.string());
const numberValue = z.preprocess((value) => Number(value) || 0, z.number());

const categorySchema = z.object({
  type_id: numberValue,
  type_pid: numberValue,
  type_name: text,
});

const movieSchema = z
  .object({
    vod_id: text,
    vod_name: text,
    vod_pic: text.optional().default(""),
    vod_remarks: text.optional().default(""),
    vod_year: text.optional().default(""),
    vod_area: text.optional().default(""),
    vod_score: text.optional().default(""),
    type_name: text.optional().default(""),
    vod_class: text.optional().default(""),
    vod_actor: text.optional().default(""),
    vod_director: text.optional().default(""),
    vod_writer: text.optional().default(""),
    vod_lang: text.optional().default(""),
    vod_pubdate: text.optional().default(""),
    vod_time: text.optional().default(""),
    vod_blurb: text.optional().default(""),
    vod_content: text.optional().default(""),
    vod_play_from: text.optional().default(""),
    vod_play_url: text.optional().default(""),
  })
  .passthrough();

const responseSchema = z
  .object({
    page: numberValue.optional().default(1),
    pagecount: numberValue.optional().default(1),
    total: numberValue.optional().default(0),
    list: z.array(movieSchema).optional().default([]),
    class: z.array(categorySchema).optional().default([]),
  })
  .passthrough();

type RawMovie = z.infer<typeof movieSchema>;

const CATEGORY_CHILDREN: Record<number, number[]> = {
  1: [6, 7, 8, 9, 10, 11, 12, 20, 49],
  2: [13, 14, 15, 16, 21, 22, 23, 24],
  3: [25, 26, 27, 28],
  4: [29, 30, 31, 32, 33],
};

interface RequestOptions {
  sourceId?: SourceId;
  action?: "list" | "detail";
  page?: number;
  typeId?: number;
  keyword?: string;
  ids?: string;
}

interface ResolveCacheValue {
  found: boolean;
  movie: MovieSummary | null;
}

export async function listMovies(options: RequestOptions = {}): Promise<MoviePage> {
  const sourceId = options.sourceId ?? DEFAULT_SOURCE_ID;
  // The MacCMS list action omits posters on some providers; detail keeps paging but returns card fields.
  const response = await requestMacCms({ ...options, sourceId, action: "detail" });

  return {
    page: response.page,
    pageCount: response.pagecount,
    total: response.total,
    items: response.list
      .filter(isAllowedMovie)
      .map((movie) => toMovieSummary(movie, sourceId)),
  };
}

export async function listCategoryMovies(typeId: number, page = 1): Promise<MoviePage> {
  const childIds = CATEGORY_CHILDREN[typeId];
  if (!childIds) return listMovies({ typeId, page });

  const settled = await Promise.allSettled(
    childIds.map((childId) => listMovies({ typeId: childId, page })),
  );
  const pages = settled.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );
  if (pages.length === 0) return { page, pageCount: 1, total: 0, items: [] };

  return {
    page,
    pageCount: Math.max(...pages.map((result) => result.pageCount)),
    total: pages.reduce((sum, result) => sum + result.total, 0),
    items: interleaveMovies(pages.map((result) => result.items), 20),
  };
}

export async function searchMovies(
  keyword: string,
  sourceId: SourceId = DEFAULT_SOURCE_ID,
  page = 1,
): Promise<MoviePage> {
  if (!keyword.trim()) return { page: 1, pageCount: 1, total: 0, items: [] };

  const response = await requestMacCms({
    sourceId,
    action: "detail",
    keyword: keyword.trim(),
    page,
  });

  return {
    page: response.page,
    pageCount: response.pagecount,
    total: response.total,
    items: response.list
      .filter(isAllowedMovie)
      .map((movie) => toMovieSummary(movie, sourceId)),
  };
}

export async function getCategories(): Promise<Category[]> {
  const response = await requestMacCms({ action: "list" });
  return response.class
    .map((category) => ({
      id: category.type_id,
      parentId: category.type_pid,
      name: category.type_name,
    }))
    .filter((category) => !isBlockedCategory(category.name));
}

export async function getMovieDetail(sourceId: SourceId, id: string) {
  const response = await requestMacCms({
    sourceId,
    action: "detail",
    ids: id,
  });
  const movie = response.list.find(isAllowedMovie);
  return movie ? toMovieDetail(movie, sourceId) : null;
}

export async function resolveMovieByTitle(title: string) {
  const key = cacheKeys.resolveTitle(title);
  const cached = await getJsonCache<ResolveCacheValue>(key);
  if (cached) return cached.movie;

  const results = await searchMovies(title, DEFAULT_SOURCE_ID);
  const normalized = normalizeTitle(title);
  const movie = results.items.find((item) => normalizeTitle(item.name) === normalized) ?? null;
  await setJsonCache(key, { found: Boolean(movie), movie }, movie ? longContentTtl() : shortMissTtl());
  return movie;
}

export async function aggregateMovieDetail(sourceId: SourceId, id: string) {
  const key = cacheKeys.detail(sourceId, id);
  const cached = await getJsonCache<MovieDetail | null>(key);
  if (cached) return cached;

  const primary = await getMovieDetail(sourceId, id);
  if (!primary) return null;

  const otherResults = await Promise.allSettled(
    SOURCES.filter((source) => source.id !== sourceId).map((source) =>
      findMatchingLine(source, primary.name),
    ),
  );
  const lines = [
    ...primary.playbackLines,
    ...otherResults.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : [],
    ),
  ];
  const sourceOrder = new Map(SOURCES.map((source, index) => [source.id, index]));

  const detail = {
    ...primary,
    playbackLines: lines
      .filter((line, index, all) => all.findIndex((item) => item.sourceId === line.sourceId) === index)
      .sort((a, b) => (sourceOrder.get(a.sourceId) ?? 99) - (sourceOrder.get(b.sourceId) ?? 99)),
  };
  await setJsonCache(key, detail, longContentTtl());
  return detail;
}

async function findMatchingLine(source: SourceDefinition, title: string) {
  const search = await searchMovies(title, source.id);
  const normalized = normalizeTitle(title);
  const match = search.items.find((movie) => normalizeTitle(movie.name) === normalized);
  if (!match) return null;

  const detail = await getMovieDetail(source.id, match.id);
  return detail?.playbackLines[0] ?? null;
}

async function requestMacCms(options: RequestOptions) {
  const source = getSource(options.sourceId ?? DEFAULT_SOURCE_ID);
  if (!source) throw new Error("不支持的数据源");

  const url = new URL(source.baseUrl);
  url.searchParams.set("ac", options.action ?? "list");
  if (options.page) url.searchParams.set("pg", String(options.page));
  if (options.typeId) url.searchParams.set("t", String(options.typeId));
  if (options.keyword) url.searchParams.set("wd", options.keyword);
  if (options.ids) url.searchParams.set("ids", options.ids);

  const response = await fetch(url, {
    cache: "no-store",
    headers: { "User-Agent": "OnlineCinema/1.0" },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`数据源请求失败：${response.status}`);

  return responseSchema.parse(await response.json());
}

function toMovieSummary(movie: RawMovie, sourceId: SourceId): MovieSummary {
  return {
    id: movie.vod_id,
    sourceId,
    name: movie.vod_name,
    cover: movie.vod_pic,
    remarks: movie.vod_remarks,
    typeName: movie.type_name,
    year: movie.vod_year,
    area: movie.vod_area,
    score: movie.vod_score,
  };
}

function toMovieDetail(movie: RawMovie, sourceId: SourceId): MovieDetail {
  const source = getSource(sourceId);
  const groups = parsePlaybackGroups(movie.vod_play_from, movie.vod_play_url);
  const preferred = selectPreferredGroup(groups);
  const playbackLines: PlaybackLine[] = preferred && source
    ? [{
        id: source.id,
        sourceId: source.id,
        sourceName: source.name,
        movieId: movie.vod_id,
        playFrom: preferred.name,
        episodes: preferred.episodes,
      }]
    : [];

  return {
    ...toMovieSummary(movie, sourceId),
    actor: movie.vod_actor,
    director: movie.vod_director,
    writer: movie.vod_writer,
    language: movie.vod_lang,
    releaseDate: movie.vod_pubdate,
    updatedAt: movie.vod_time,
    summary: cleanHtml(movie.vod_content || movie.vod_blurb),
    playbackLines,
  };
}

function isAllowedMovie(movie: RawMovie) {
  return !isBlockedContent(movie.vod_name, movie.type_name, movie.vod_class);
}

function interleaveMovies(groups: MovieSummary[][], limit: number) {
  const items: MovieSummary[] = [];
  const maxLength = Math.max(0, ...groups.map((group) => group.length));
  for (let row = 0; row < maxLength && items.length < limit; row += 1) {
    for (const group of groups) {
      const movie = group[row];
      if (movie && !items.some((item) => item.sourceId === movie.sourceId && item.id === movie.id)) {
        items.push(movie);
        if (items.length === limit) break;
      }
    }
  }
  return items;
}
