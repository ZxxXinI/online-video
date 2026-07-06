import type { Episode } from "@/lib/types";

export interface RawPlaybackGroup {
  name: string;
  episodes: Episode[];
}

export function parsePlaybackGroups(
  playFrom: string | null | undefined,
  playUrl: string | null | undefined,
): RawPlaybackGroup[] {
  const names = (playFrom ?? "").split("$$$");
  const groups = (playUrl ?? "").split("$$$");
  const count = Math.max(names.length, groups.length);

  return Array.from({ length: count }, (_, index) => {
    const name = names[index]?.trim() || `线路${index + 1}`;
    return { name, episodes: parseEpisodes(groups[index] ?? "") };
  }).filter((group) => group.episodes.length > 0);
}

export function selectPreferredGroup(groups: RawPlaybackGroup[]) {
  return (
    groups.find((group) => /m3u8|hls/i.test(group.name)) ?? groups[0] ?? null
  );
}

function parseEpisodes(raw: string): Episode[] {
  return raw
    .split("#")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => {
      const delimiter = segment.indexOf("$");
      if (delimiter < 0) return { name: "播放", url: normalizeUrl(segment) };

      return {
        name: segment.slice(0, delimiter).trim() || "播放",
        url: normalizeUrl(segment.slice(delimiter + 1)),
      };
    })
    .filter((episode) => /^https?:\/\//i.test(episode.url));
}

function normalizeUrl(input: string) {
  const markdown = input.match(/\((https?:\/\/[^)]+)\)/i)?.[1];
  const bracket = input.match(/\[(https?:\/\/[^\]]+)\]/i)?.[1];
  return (markdown ?? bracket ?? input).trim().replace(/^\[|\]$/g, "");
}
