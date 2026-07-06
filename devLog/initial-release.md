# 第一版基础闭环 - 2026-07-06

## File Changes

- `package.json`、`pnpm-workspace.yaml`：配置 Next.js、数据解析、HLS、Vitest 和 Playwright 依赖。
- `src/lib/`：创建统一影视类型、允许列表数据源、MacCMS 适配器、热播采集、内容过滤和播放字段解析。
- `src/app/`：创建首页、分类、搜索、详情、播放、热播解析和健康检查路由。
- `src/components/`：创建响应式导航、三/六列海报、线路选集和 HLS 播放器。
- `Dockerfile`、`.dockerignore`：创建非 root standalone 生产镜像和健康检查。
- `src/**/*.test.ts`、`tests/e2e/`：覆盖解析规则、内容过滤和响应式布局。
- `README.md`：记录功能、运行、测试、部署与数据流。

## Reason / Purpose

建立与 Android TVBox 独立的网页项目，在不复制目标站品牌素材的前提下实现相似的信息密度和浏览结构。MacCMS 作为稳定主数据源，网页热播仅用于首页推荐排序；点击后再查询资源，降低首页延迟与接口压力。

## Bug Record

- 时间：2026-07-06 09:45
- 症状：pnpm 11 阻止 `sharp` 和 `unrs-resolver` 安装脚本，官方脚手架未完成 Git 初始化。
- 尝试修复：确认 pnpm 11 已将构建许可从 `package.json` 迁移到 `pnpm-workspace.yaml`。
- 临时方案：无；已在工作区配置中明确允许两个已知依赖并重新安装成功。

- 时间：2026-07-06 10:06
- 症状：桌面截图中品牌文字显示为黑色，未应用红色强调色。
- 尝试修复：检查浏览器计算样式，确认顶层 `a { color: inherit }` 覆盖了 Tailwind layer 中的颜色工具类。
- 临时方案：无；已移除不必要的全局链接颜色覆盖。

- 时间：2026-07-06 10:07
- 症状：普通首页分区显示片名占位符，海报为空。
- 尝试修复：对比 MacCMS `ac=list` 和 `ac=detail` 响应，确认量子列表动作省略 `vod_pic`。
- 临时方案：无；分页列表改用仍支持分页的 `ac=detail`，保留 `ac=list` 获取分类。

- 时间：2026-07-06 10:12
- 症状：一级分类接口只返回直接挂载在父分类下的少量影片。
- 尝试修复：验证 `t=1/2/3/4` 不会自动包含子分类。
- 临时方案：无；按已知父子分类并行查询，并以轮询方式混排、去重和限制每页 20 条。

## Verification

- `pnpm lint`：通过。
- `pnpm test`：3 个测试文件、5 个测试通过。
- `pnpm build`：Next.js 生产构建通过。
- `pnpm test:e2e`：桌面和手机共 4 个测试通过。
- 实际播放：量子线路正确显示 CORS 错误；切换如意后视频达到 `readyState=4`。
- Docker：当前电脑未安装 Docker CLI，未执行镜像构建。

## Navigation

- Master doc: [README.md](README.md)
- Branch doc: 本文件
