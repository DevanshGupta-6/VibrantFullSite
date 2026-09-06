import { Redis } from "@upstash/redis";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const redis = Redis.fromEnv();

const OLD_KEY = "ambassadors";
const SET_KEY = "ca:ambassadors";
const COUNTER_KEY = "ca:next_id";

interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}

async function main() {
  const existing =
    await redis.get<Ambassador[]>(OLD_KEY);

  if (!existing || !Array.isArray(existing)) {
    console.log("No old ambassador array found.");
    return;
  }

  let highestId = 0;

  for (const ambassador of existing) {
    if (!ambassador.code) continue;

    const match = ambassador.code.match(/^CA(\d+)$/);

    if (!match) continue;

    const numericId = Number(match[1]);

    if (numericId > highestId) {
      highestId = numericId;
    }

    await redis.hset(
      `ca:ambassador:${ambassador.code}`,
      {
        name: ambassador.name,
        contact: ambassador.contact,
        branch: ambassador.branch,
        code: ambassador.code,
        enrolledAt: ambassador.enrolledAt,
      }
    );

    await redis.sadd(
      SET_KEY,
      ambassador.code
    );
  }

  await redis.set(
    COUNTER_KEY,
    highestId
  );

  console.log(
    `Migrated ${existing.length} ambassadors.`
  );

  console.log(
    `Counter initialized at ${highestId}.`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});