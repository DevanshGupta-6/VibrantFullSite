import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  try {
    const redis = Redis.fromEnv();
    
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false };
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(now);
    
    let year = "", month = "", day = "";
    parts.forEach(p => {
      if (p.type === 'year') year = p.value;
      if (p.type === 'month') month = p.value;
      if (p.type === 'day') day = p.value;
    });
    const dateStr = `${year}-${month}-${day}`;
    
    const baselineKey = `daily_baseline_${dateStr}`;
    const frozenKey = `daily_frozen_${dateStr}`;

    await redis.del(baselineKey);
    await redis.del(frozenKey);

    return NextResponse.json({ success: true, message: `Deleted ${baselineKey} and ${frozenKey}` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}