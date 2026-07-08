# 在线影院 - 2026-07-07

## File Changes

- `src/app/globals.css`
  - 原因 / 目的：重建全局视觉 token、卡片层级、英雄区和按钮样式，将整体气质从中性工具风切换为深色影院风格。
- `src/components/site-shell.tsx`
  - 原因 / 目的：重做整体壳层，增强品牌、搜索与侧栏结构，让首页和内页都处于统一的内容浏览框架中。
- `src/components/site-nav.tsx`
  - 原因 / 目的：将导航从普通列表改为更明确的内容入口样式，增强当前项识别度。
- `src/app/page.tsx`
  - 原因 / 目的：加入英雄区，强化首页第一屏的沉浸感，并为热播和分类区补充更明确的视觉节奏。
- `src/components/section.tsx`
  - 原因 / 目的：统一分区标题、分割线和“查看更多”按钮样式。
- `src/components/movie-card.tsx`
  - 原因 / 目的：让海报卡片展示评分、标签和二级元数据，提升内容浏览质感。
- `src/components/hot-grid.tsx`
  - 原因 / 目的：将热播卡片与普通卡片统一语言，同时保留热播点击后再解析资源的流程。
- `src/app/category/[typeId]/page.tsx`
  - 原因 / 目的：让分类页拥有频道头图式布局和更清晰的筛选区域。
- `src/app/search/page.tsx`
  - 原因 / 目的：重做搜索页头部，让搜索结果页不再像普通表单页面。
- `src/app/video/[source]/[id]/page.tsx`
  - 原因 / 目的：重做详情页信息层级和播放入口，使其更像观影前页而不是资料卡。
- `src/components/episode-selector.tsx`
  - 原因 / 目的：让线路和选集区域统一为圆角深色面板。
- `src/components/video-player.tsx`
  - 原因 / 目的：强化播放页右侧信息与切线区域的沉浸感，同时保留现有播放逻辑。
- `src/app/watch/[source]/[id]/[episode]/page.tsx`
  - 原因 / 目的：重做播放页播放器下方信息区和推荐区的布局语言。
- `src/components/pagination.tsx`
  - 原因 / 目的：分页按钮改为统一的胶囊按钮风格。
- `src/app/error.tsx`
  - 原因 / 目的：统一异常状态页风格。
- `src/app/loading.tsx`
  - 原因 / 目的：让骨架屏跟新首页结构一致。
- `src/app/not-found.tsx`
  - 原因 / 目的：统一 404 页面语气与视觉。
- `src/components/theme-toggle.tsx`
  - 原因 / 目的：让主题切换按钮与新的玻璃面板风格统一。
- `src/components/poster-image.tsx`
  - 原因 / 目的：优化断图占位，避免回退到普通文本块。
- `eslint.config.mjs`
  - 原因 / 目的：补充 `test-results` 等目录忽略，避免 Playwright 跑完后影响 lint。
- `tests/e2e/responsive.spec.ts`
  - 原因 / 目的：收窄首页断言，匹配新的英雄区与热播标题结构。
- `README.md`
  - 原因 / 目的：同步新的产品气质和功能说明。
- `DESIGN.md`
  - 原因 / 目的：用新的影院风格设计约束替换旧的 Astryx 中性描述。
- `devLog/README.md`
  - 原因 / 目的：加入这次重设计时间线入口。

## Verification

- `pnpm lint`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`

## Notes

- Playwright 验证已通过，但开发服务器日志里仍会出现 Next.js 对超大外部响应无法写入 fetch cache 的提示；这是外部接口体积导致的缓存提示，不影响本次页面重设计结果。
