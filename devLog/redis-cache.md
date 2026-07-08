# Redis Server Cache - 2026-07-08

## File Changes

- `package.json` / `pnpm-lock.yaml`
  - Reason / Purpose: Add `ioredis` for TLS Redis access.
- `.env.example`
  - Reason / Purpose: Document Redis connection variables using placeholders only.
- `.gitignore`
  - Reason / Purpose: Ignore local `ca.crt` so the Redis CA certificate is not committed.
- `src/lib/cache/redis.ts`
  - Reason / Purpose: Create the optional Redis client and support host, port, TLS, CA, and hostname-verification configuration.
- `src/lib/cache/json-cache.ts`
  - Reason / Purpose: Provide safe JSON cache get, set, and get-or-set helpers.
- `src/lib/cache/keys.ts`
  - Reason / Purpose: Centralize cache key names for home, title resolve, and detail aggregation data.
- `src/lib/cache/ttl.ts`
  - Reason / Purpose: Implement 20-hour TTL plus random 10 to 20 minute jitter, with shorter miss caching.
- `src/lib/home-cache.ts`
  - Reason / Purpose: Cache home category blocks.
- `src/lib/hot.ts`
  - Reason / Purpose: Cache scraped hot recommendations.
- `src/lib/mac-cms.ts`
  - Reason / Purpose: Cache title resolution and aggregated detail results.
- `src/app/page.tsx`
  - Reason / Purpose: Use cached home category loaders.
- `docs/redis-cache.md`
  - Reason / Purpose: Document cache coverage, TTL, TLS settings, and fallback behavior.
- `README.md`
  - Reason / Purpose: Add Redis cache documentation entry.
- `devLog/README.md`
  - Reason / Purpose: Add timeline entries for Redis cache work.

## Bug Record

- Time: 2026-07-08 11:25
- Symptoms: Redis TCP connection and password authentication worked, but the project cache client failed with `Hostname/IP does not match certificate's altnames` when connecting by IP.
- Attempted fix: Added `REDIS_TLS_REJECT_UNAUTHORIZED` support in `src/lib/cache/redis.ts`, documented the IP + TLS certificate mismatch case, and kept strict verification as the default.
- Temporary solution: Set `REDIS_TLS_REJECT_UNAUTHORIZED=false` in local `.env.local` when connecting by IP to a TLS Redis server whose certificate does not include that IP.

- Time: 2026-07-08 11:52
- Symptoms: Docker logs showed `Failed to set Next.js data cache ... items over 2MB can not be cached` for large MacCMS responses.
- Attempted fix: Changed MacCMS and hot-source fetches to `cache: "no-store"` so Next.js does not cache raw external responses. Redis remains the explicit application cache for processed results.
- Temporary solution: None. Redeploy the container after pulling this change.

- Time: 2026-07-08 15:05
- Symptoms: Redis could still be reached externally, but the website stopped adding new cache values after running for a while or after Redis data was cleared.
- Attempted fix: Added `ensureRedisClient()` to reconnect or rebuild the Redis client when the cached ioredis instance is no longer `ready`. Cache reads and writes now use this helper instead of only connecting from the initial `wait` state.
- Temporary solution: Redeploy the container after pulling this change. Existing Redis keys do not need manual migration.

- Time: 2026-07-08 15:32
- Symptoms: Redis worked on the first visit, then a few minutes later cache reads and writes failed with `Command timed out` while the external Redis service was still reachable.
- Attempted fix: Added TCP keep-alive, configurable connect/command timeouts, and timeout-triggered Redis client reset. This handles half-open public TLS connections by forcing the next request to create a fresh Redis connection.
- Temporary solution: Redeploy the container after pulling this change. If the Redis network is still slow, increase `REDIS_COMMAND_TIMEOUT_MS` in `.env.production`.

## Navigation

- Master doc: `devLog/README.md`
- Branch doc: `devLog/redis-cache.md`
