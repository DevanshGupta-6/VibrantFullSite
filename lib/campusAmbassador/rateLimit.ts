import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function checkCampusAmbassadorRateLimit(
  key: string,
  limit = 5,
  windowSeconds = 60 * 60
): Promise<boolean> {
  const redisKey = `ca:rate:${key}`;

  const count = await redis.incr(redisKey);

  if (count === 1) {
    await redis.expire(redisKey, windowSeconds);
  }

  return count <= limit;
}