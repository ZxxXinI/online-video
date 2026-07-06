const BLOCKED_KEYWORDS = ["伦理", "电影解说"];
const BLOCKED_CATEGORY_NAMES = ["演员", "新闻资讯", "电影资讯", "娱乐新闻"];

export function isBlockedContent(...fields: Array<string | null | undefined>) {
  return fields.some((field) => {
    const value = field ?? "";
    return BLOCKED_KEYWORDS.some((keyword) => value.includes(keyword));
  });
}

export function isBlockedCategory(name: string) {
  return (
    BLOCKED_CATEGORY_NAMES.some((blocked) => name.includes(blocked)) ||
    isBlockedContent(name)
  );
}

export function cleanHtml(input: string | null | undefined) {
  if (!input) return "";

  return input
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeTitle(title: string) {
  return title
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toLocaleLowerCase("zh-CN");
}
