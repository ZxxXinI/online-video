import { getRedisClient } from "@/lib/cache/redis";

export async function getJsonCache<T>(key: string): Promise<T | null> {
  const redis = getRedisClient();
  if (!redis) return null;

  try {
    if (redis.status === "wait") await redis.connect();
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export async function setJsonCache<T>(key: string, value: T, ttlSeconds: number) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    if (redis.status === "wait") await redis.connect();
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
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
