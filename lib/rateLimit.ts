import { Redis } from "@upstash/redis";
import { AppError } from "@/lib/errors";

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const localStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production.");
    }
    const now = Date.now();
    const item = localStore.get(key);
    if (!item || item.resetAt <= now) {
      localStore.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
      return { allowed: true, remaining: limit - 1, resetAt: now + windowSeconds * 1000 };
    }
    item.count += 1;
    return { allowed: item.count <= limit, remaining: Math.max(0, limit - item.count), resetAt: item.resetAt };
  }

  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSeconds);
  const ttl = await redis.ttl(key);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count), resetAt: Date.now() + Math.max(ttl, 0) * 1000 };
}

export async function enforceRateLimit(key: string, limit: number, windowSeconds: number) {
  const result = await checkRateLimit(key, limit, windowSeconds);
  if (!result.allowed) {
    throw new AppError("RATE_LIMITED", "Too many requests. Please try again later.");
  }
  return result;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
