import fs from "node:fs";
import path from "node:path";
import Redis, { type RedisOptions } from "ioredis";

let client: Redis | null | undefined;

function getRedisOptions() {
  const url = process.env.REDIS_URL;
  const host = process.env.REDIS_HOST;
  const password = process.env.REDIS_PASSWORD;

  if (!url && !host) return null;

  const port = Number(process.env.REDIS_PORT || 6380);
  const username = process.env.REDIS_USERNAME || undefined;
  const db = Number(process.env.REDIS_DB || 0);
  const tlsEnabled = process.env.REDIS_TLS !== "false";
  const rejectUnauthorized = process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== "false";
  const caPath = process.env.REDIS_CA_PATH || "ca.crt";
  const resolvedCaPath = path.isAbsolute(caPath) ? caPath : path.join(process.cwd(), "ca.crt");
  const ca = tlsEnabled && fs.existsSync(resolvedCaPath) ? fs.readFileSync(resolvedCaPath) : undefined;
  const tls = tlsEnabled ? { ca: ca ? [ca] : undefined, rejectUnauthorized } : undefined;

  if (url) {
    return { url, options: { username, password, db, tls } };
  }

  return {
    options: {
      host,
      port,
      username,
      password,
      db,
      tls,
    },
  };
}

export function getRedisClient() {
  if (client !== undefined) return client;

  const config = getRedisOptions();
  if (!config) {
    client = null;
    return client;
  }

  const baseOptions = {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    connectTimeout: 2_000,
    commandTimeout: 2_000,
    enableOfflineQueue: false,
  } satisfies RedisOptions;

  client = config.url
    ? new Redis(config.url, { ...baseOptions, ...config.options })
    : new Redis({ ...baseOptions, ...config.options });

  client.on("error", () => {
    // Redis is an optional acceleration layer. Runtime errors should fall back to source requests.
  });

  return client;
}
