import { Redis } from "@upstash/redis";

export const campusAmbassadorRedis = Redis.fromEnv();

export const AMBASSADOR_SET_KEY = "ca:ambassadors";
export const AMBASSADOR_COUNTER_KEY = "ca:next_id";

export function ambassadorKey(code: string) {
  return `ca:ambassador:${code}`;
}

export interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}