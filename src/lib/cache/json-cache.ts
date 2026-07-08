import { ensureRedisClient, resetRedisClient } from "@/lib/cache/redis";

export async function getJsonCache<T>(key: string): Promise<T | null> {
  const redis = await ensureRedisClient();
  if (!redis) return null;

  try {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    resetRedisClientOnTimeout(error);
    logCacheError("read", key, error);
    return null;
  }
}

export async function setJsonCache<T>(key: string, value: T, ttlSeconds: number) {
  const redis = await ensureRedisClient();
  if (!redis) return;

  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    resetRedisClientOnTimeout(error);
    logCacheError("write", key, error);
    // Cache writes are best-effort.
  }
}

export async function getOrSetJsonCache<T>(key: string, ttlSeconds: number, loader: () => Promise<T>): Promise<T> {
  const cached = await getJsonCache<T>(key);
  if (cached !== null) return cached;

  const value = await loader();
  await setJsonCache(key, value, ttlSeconds);
  return value;
}

function logCacheError(action: "read" | "write", key: string, error: unknown) {
  if (process.env.NODE_ENV === "production") return;
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[redis-cache] ${action} failed for ${key}: ${message}`);
}

function resetRedisClientOnTimeout(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes("timed out")) {
    resetRedisClient();
  }
}
