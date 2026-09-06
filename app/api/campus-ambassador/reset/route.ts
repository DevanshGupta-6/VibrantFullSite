// app/api/campus-ambassador/reset/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/auth/authorize";

export async function POST(request: Request) {
  try {
    await requirePermission("campus_ambassador.reset");

    const supabase = await createClient();

    const redis = (await import("@upstash/redis")).Redis.fromEnv();

    const now = new Date();

    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const parts = formatter.formatToParts(now);

    let year = "";
    let month = "";
    let day = "";

    for (const part of parts) {
      if (part.type === "year") year = part.value;
      if (part.type === "month") month = part.value;
      if (part.type === "day") day = part.value;
    }

    const dateStr = `${year}-${month}-${day}`;

    const baselineKey = `daily_baseline_${dateStr}`;
    const frozenKey = `daily_frozen_${dateStr}`;

    await redis.del(baselineKey);
    await redis.del(frozenKey);

    return NextResponse.json({
      success: true,
      message: "Leaderboard daily state reset.",
    });
  } catch (error) {
    console.error("Campus ambassador reset failed:", error);

    return NextResponse.json(
      { error: "Unable to reset leaderboard." },
      { status: 500 }
    );
  }
}
