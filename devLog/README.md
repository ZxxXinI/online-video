# 在线影院开发日志

## 时间线

| 时间 | 模块 | 内容 | 详细记录 |
| --- | --- | --- | --- |
| 2026-07-06 09:59 | 第一版基础闭环 | 初始化独立仓库，完成数据层、响应式页面、播放器、测试和 Docker | [initial-release.md](initial-release.md) |
| 2026-07-06 10:14 | 验收修整 | 修复品牌颜色、MacCMS 海报字段和一级分类聚合 | [initial-release.md](initial-release.md) |

## 模块导航

- 数据与采集：`src/lib/`
- 页面与接口：`src/app/`
- 视觉与交互：`src/components/`
- 测试：`src/**/*.test.ts`、`tests/e2e/`
- 部署：`Dockerfile`、`.dockerignore`
