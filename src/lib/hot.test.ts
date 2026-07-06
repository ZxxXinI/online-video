import { describe, expect, it } from "vitest";
import { parseHotRecommendations } from "@/lib/hot";

describe("hot recommendation parser", () => {
  it("extracts title, lazy image and remarks from the hot module", () => {
    const html = `
      <div class="module">
        <h1 class="module-title">网飞啦热播 <span>Popular TV</span></h1>
        <a class="module-poster-item" title="测试剧">
          <div class="module-item-note">第8集</div>
          <img data-original="https://img.test/poster.webp" src="load.jpg" alt="测试剧">
        </a>
      </div>`;

    expect(parseHotRecommendations(html)).toEqual([
      {
        id: "hot-0-测试剧",
        name: "测试剧",
        cover: "https://img.test/poster.webp",
        remarks: "第8集",
      },
    ]);
  });
});
