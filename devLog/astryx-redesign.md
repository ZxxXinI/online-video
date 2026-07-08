# Astryx 风格 UI 重设计 - 2026-07-06 16:09

## File Changes

- `src/app/globals.css`：建立浅色/深色语义 token、统一圆角、边界、海报与焦点状态。
- `src/app/layout.tsx`：在 React 加载前恢复用户主题，避免主题闪烁。
- `src/components/theme-toggle.tsx`：新增网站级主题切换和本地持久化。
- `src/components/site-nav.tsx`、`site-shell.tsx`：新增当前路由状态、钴蓝品牌标记、响应式导航和紧凑搜索。
- `src/components/`、`src/app/` 页面：将固定红色和白色表面迁移为语义 token。
- `tests/e2e/responsive.spec.ts`：新增主题切换、刷新持久化测试。
- `DESIGN.md`：记录设计判断、三个 dial、token 和 Astryx 适配边界。

## Reason / Purpose

根据 SiYuan“日志/AI”中的 Astryx 资料和官方设计系统，将第一版资源站式红色 UI 改为更中性、可预测、可访问的影视工具界面。保留现有 Tailwind 和业务路由，不引入仍处于 Beta 的 Astryx/StyleX 运行时依赖。

## Bug Record

- 时间：2026-07-06 15:58
- 症状：Next.js 开发工具的 Dark 选项只影响工具面板，网站没有自己的主题系统。
- 尝试修复：新增根级主题 token、切换按钮和 `localStorage` 恢复脚本。
- 临时方案：无；网站明暗主题已独立生效并持久化。

- 时间：2026-07-06 16:01
- 症状：主题持久化端到端测试在刷新后错误地恢复浅色。
- 尝试修复：确认 `addInitScript` 会在每次导航时执行并覆盖用户刚保存的主题。
- 临时方案：无；测试改为页面加载后只初始化一次浅色，再执行切换和刷新验证。

- 时间：2026-07-06 16:12
- 症状：生产构建首次预渲染首页时，外部影视接口超过 60 秒并触发重试。
- 尝试修复：将首页改为请求时渲染，继续复用各数据请求的 `revalidate` 缓存。
- 临时方案：无；部署构建不再依赖第三方接口实时可用。

## Navigation

- Master doc: [README.md](README.md)
- Design doc: [DESIGN.md](../DESIGN.md)
- Branch doc: 本文件
