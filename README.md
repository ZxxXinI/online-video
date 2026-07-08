# 在线影院

一个面向桌面与手机浏览器的响应式影视网站。项目使用 MacCMS API 获取影视列表、详情和播放地址，并以公开网页的热播信息作为首页排序参考。

## 功能

- 首页英雄区、热播、剧集、电影、动漫和综艺分区
- 分类筛选、关键词搜索与分页
- 影视详情、多数据源线路和选集
- HLS/m3u8 播放、原生 HLS 回退和播放错误提示
- 桌面六列、手机三列的响应式海报网格
- 深色影院风格主题与可持久化明暗切换
- “伦理”“电影解说”、演员和新闻资讯过滤
- Docker standalone 部署和健康检查

## 技术栈

- Next.js 16 App Router、React 19、TypeScript
- Tailwind CSS 4
- hls.js、Cheerio、Zod
- Vitest、Playwright
- pnpm 11、Node.js 24

## 本地运行

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## 检查命令

```powershell
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

## Docker

```powershell
docker build -t online-video .
docker run --rm -p 3000:3000 --name online-video online-video
```

健康检查地址：[http://localhost:3000/api/health](http://localhost:3000/api/health)。

## Redis 缓存

项目支持可选 Redis 服务端缓存，用于缓存首页热播、首页分类、热播点击解析结果和详情聚合结果。未配置 Redis 时会自动回退到原始接口请求。

配置说明见 [docs/redis-cache.md](C:\Users\Zxx\Documents\online-video\docs\redis-cache.md)。

## 数据流

1. 首页“在线影院热播”在服务端读取网飞啦首页的片名、海报和更新状态。
2. 用户点击热播卡片时，网站再按片名查询量子 MacCMS 接口。
3. 分类、搜索和普通首页分区直接使用量子接口。
4. 详情页按片名并行匹配其他允许的数据源，仅展示实际存在的播放线路。
5. 浏览器直接播放资源地址，服务器不代理 m3u8 和视频分片。

内置数据源均在 `src/lib/sources.ts` 中以允许列表维护，前端不能提交任意接口地址。

## 目录

```text
src/app/          页面与 Route Handlers
src/components/   页面组件和播放器
src/lib/          数据源、解析、过滤和领域类型
tests/e2e/        响应式端到端测试
devLog/           AI 辅助开发记录
```

视觉 token、组件状态和设计约束见 [DESIGN.md](C:\Users\Zxx\Documents\online-video\DESIGN.md)。

## 注意

- 外部海报使用动态域名，采用原生懒加载并设置 `no-referrer`。
- HLS 资源需要允许浏览器跨域读取；不支持 CORS 的线路会提示用户切换线路。
- 使用者应确保影视元数据及播放资源具有合法授权。
