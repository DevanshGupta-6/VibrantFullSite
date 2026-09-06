// app/api/campus-ambassador/reset/route.ts

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Verify authenticated Supabase user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify that the authenticated user is an active SUPER_ADMIN.
    const { data: admin, error: adminError } = await supabase
      .from("admin_users")
      .select(`
        id,
        status,
        roles:role_id (
          code
        )
      `)
      .eq("id", user.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const role = Array.isArray(admin.roles)
      ? admin.roles[0]
      : admin.roles;

    if (
      admin.status !== "ACTIVE" ||
      role?.code !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const redis = Redis.fromEnv();

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