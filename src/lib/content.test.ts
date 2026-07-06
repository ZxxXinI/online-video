import { describe, expect, it } from "vitest";
import { cleanHtml, isBlockedCategory, isBlockedContent, normalizeTitle } from "@/lib/content";

describe("content helpers", () => {
  it("filters blocked movie and category keywords", () => {
    expect(isBlockedContent("某伦理片")).toBe(true);
    expect(isBlockedContent("普通电影")).toBe(false);
    expect(isBlockedCategory("新闻资讯")).toBe(true);
  });

  it("cleans html and normalizes titles", () => {
    expect(cleanHtml("<p>第一段&nbsp;内容</p><p>第二段</p>")).toBe("第一段 内容 第二段");
    expect(normalizeTitle("问心 2（2026）")).toBe(normalizeTitle("问心2(2026)"));
  });
});
