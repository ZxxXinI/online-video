# Redis Cache

## Goal

Redis is an optional server-side cache for reducing repeated requests to hot, home category, title resolve, and detail aggregation sources. If Redis is not configured or the connection fails, the website falls back to the original source requests.

## Cached Content

| Content | Key | TTL |
| --- | --- | --- |
| Home hot list | `online-video:home:hot` | 20 hours + random 10 to 20 minutes |
| Home drama list | `online-video:home:category:2` | 20 hours + random 10 to 20 minutes |
| Home movie list | `online-video:home:category:1` | 20 hours + random 10 to 20 minutes |
| Home anime list | `online-video:home:category:4` | 20 hours + random 10 to 20 minutes |
| Home variety list | `online-video:home:category:3` | 20 hours + random 10 to 20 minutes |
| Hot title resolve | `online-video:resolve:title:{normalizedTitle}` | Hit: 20 hours + random jitter; miss: 1 hour + random jitter |
| Aggregated detail | `online-video:detail:{sourceId}:{movieId}` | 20 hours + random 10 to 20 minutes |

## Environment Variables

Example `.env.local`:

```env
REDIS_HOST=your-server-ip-or-domain
REDIS_PORT=6380
REDIS_USERNAME=
REDIS_PASSWORD=your-password
REDIS_DB=0
REDIS_TLS=true
REDIS_CA_PATH=ca.crt
REDIS_TLS_REJECT_UNAUTHORIZED=true
```

Equivalent command:

```bash
redis-cli -h <server-ip-or-domain> -p 6380 --tls --cacert ca.crt -a <password>
```

You can also use a single Redis URL:

```env
REDIS_URL=rediss://username:password@host:6380/0
REDIS_CA_PATH=ca.crt
```

## TLS Notes

Place `ca.crt` in the project root. The file is ignored by Git and should not be committed.

When connecting by IP to a TLS Redis server, the server certificate may not contain that IP in its subject alternative names. In that case, Node.js rejects the connection with a hostname mismatch. For this specific deployment style, set the following local-only variable:

```env
REDIS_TLS_REJECT_UNAUTHORIZED=false
```

Keep it as `true` when using a domain name that matches the Redis certificate.

## Fallback Strategy

- Redis is not configured: request source APIs directly.
- Redis connection fails: ignore the cache error and request source APIs directly.
- Redis write fails: return the page normally; only the current response is not cached.

## Related Files

```text
src/lib/cache/redis.ts       Redis client and TLS options
src/lib/cache/json-cache.ts  JSON get/set wrapper
src/lib/cache/keys.ts        Cache key definitions
src/lib/cache/ttl.ts         20-hour TTL plus random jitter
src/lib/home-cache.ts        Home category cache
src/lib/hot.ts               Hot recommendation cache
src/lib/mac-cms.ts           Title resolve and detail aggregation cache
```
