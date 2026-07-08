# Online Video Dev Log

## Timeline

| Time | Module | Summary | Detail |
| --- | --- | --- | --- |
| 2026-07-06 09:59 | Initial release | Initialized the standalone Next.js project with data, pages, player, tests, and Docker support. | [initial-release.md](initial-release.md) |
| 2026-07-06 10:14 | Acceptance fixes | Fixed brand color, MacCMS poster fields, and top-level category aggregation. | [initial-release.md](initial-release.md) |
| 2026-07-06 16:09 | Astryx redesign | Added semantic theme, light/dark modes, and shared component states. | [astryx-redesign.md](astryx-redesign.md) |
| 2026-07-07 20:30 | Cinema redesign | Rebuilt the UI around a dark cinema layout inspired by Spotify and PlayStation interaction patterns. | [cinema-redesign.md](cinema-redesign.md) |
| 2026-07-08 10:45 | Redis server cache | Added optional Redis TLS caching for hot lists, home categories, title resolve, and detail aggregation. | [redis-cache.md](redis-cache.md) |
| 2026-07-08 11:25 | Redis TLS fix | Added `REDIS_TLS_REJECT_UNAUTHORIZED` for IP-based TLS Redis deployments with certificate hostname mismatch. | [redis-cache.md](redis-cache.md) |

## Module Map

- Data and scraping: `src/lib/`
- Pages and APIs: `src/app/`
- Visual and interaction components: `src/components/`
- Tests: `src/**/*.test.ts`, `tests/e2e/`
- Deployment: `Dockerfile`, `.dockerignore`
- Design system: `DESIGN.md`, `src/app/globals.css`
- Cache docs: `docs/redis-cache.md`
