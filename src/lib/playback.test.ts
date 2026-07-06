import { describe, expect, it } from "vitest";
import { parsePlaybackGroups, selectPreferredGroup } from "@/lib/playback";

describe("playback parser", () => {
  it("parses multiple sources and episodes", () => {
    const groups = parsePlaybackGroups(
      "download$$$rym3u8",
      "正片$https://a.test/video.mp4$$$第1集$https://a.test/1.m3u8#第2集$https://a.test/2.m3u8",
    );

    expect(groups).toHaveLength(2);
    expect(groups[1].episodes[1]).toEqual({ name: "第2集", url: "https://a.test/2.m3u8" });
    expect(selectPreferredGroup(groups)?.name).toBe("rym3u8");
  });

  it("ignores empty and non-http playback entries", () => {
    const groups = parsePlaybackGroups("m3u8", "坏地址$javascript:alert(1)#无地址$");
    expect(groups).toEqual([]);
  });
});
