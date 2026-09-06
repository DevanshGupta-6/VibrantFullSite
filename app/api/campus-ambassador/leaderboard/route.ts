import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export async function GET() {
  try {
    const CSV_URL = "https://docs.google.com/spreadsheets/d/1gCruFkwZk6tKs4KUCi-ntnql3g5xFBcpUBHT77L2cvY/gviz/tq?tqx=out:csv&gid=0";

    const response = await fetch(CSV_URL, { next: { revalidate: 30 } });
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }

    const csvText = await response.text();
    const lines = csvText.split(/\r?\n/);
    
    const countMap = new Map<string, number>();

    for (const line of lines) {
      const cols = line.split('","').map(c => c.replace(/^"|"$/g, '').trim());
      
      if (cols.length > 2) {
        const code1 = cols[1];
        const count1 = parseInt(cols[2], 10);
        if (code1 && !isNaN(count1) && count1 > 0) {
          countMap.set(code1, Math.max(countMap.get(code1) || 0, count1));
        }
      }

      if (cols.length > 7) {
        const code2 = cols[6];
        const count2 = parseInt(cols[7], 10);
        if (code2 && !isNaN(count2) && count2 > 0) {
          countMap.set(code2, Math.max(countMap.get(code2) || 0, count2));
        }
      }
    }

    const leaderboard = Array.from(countMap.entries())
      .map(([referralCode, registrations]) => ({
        referralCode,
        registrations,
      }))
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 20)
      .map((entry, index) => ({
        rank: index + 1,
        ...entry,
      }));

    // --- Daily Leaderboard Logic ---
    let dailyLeaderboard: any[] = [];
    try {
      const redis = Redis.fromEnv();
      
      // Get current date string in IST to use as key, ensuring we can reset daily
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false };
      const formatter = new Intl.DateTimeFormat('en-GB', options);
      const parts = formatter.formatToParts(now);
      
      let year = "", month = "", day = "", hour = "";
      parts.forEach(p => {
        if (p.type === 'year') year = p.value;
        if (p.type === 'month') month = p.value;
        if (p.type === 'day') day = p.value;
        if (p.type === 'hour') hour = p.value;
      });
      const dateStr = `${year}-${month}-${day}`;
      // In JS Intl sometimes hour can be "24" for midnight, so let's handle that securely.
      const currentHourIST = parseInt(hour, 10) % 24;
      
      const baselineKey = `daily_baseline_${dateStr}`;
      const frozenKey = `daily_frozen_${dateStr}`;

      let baselineData = await redis.get<Record<string, number>>(baselineKey);
      
      if (!baselineData) {
        // No baseline for today, set it now.
        baselineData = Object.fromEntries(countMap);
        await redis.set(baselineKey, baselineData);
      }

      let activeCounts = countMap;

      // Check if it's 11 PM (23:00) or later in IST
      if (currentHourIST >= 23) {
        let frozenData = await redis.get<Record<string, number>>(frozenKey);
        if (!frozenData) {
          // Freeze the current counts
          frozenData = Object.fromEntries(countMap);
          await redis.set(frozenKey, frozenData);
        }
        // Use frozen data for calculations
        activeCounts = new Map(Object.entries(frozenData));
      }

      const dailyMap = new Map<string, number>();
      
      for (const [code, count] of activeCounts.entries()) {
        const baselineCount = baselineData[code] || 0;
        const dailyCount = count - baselineCount;
        if (dailyCount > 0) {
          dailyMap.set(code, dailyCount);
        }
      }

      dailyLeaderboard = Array.from(dailyMap.entries())
        .map(([referralCode, registrations]) => ({
          referralCode,
          registrations,
        }))
        .sort((a, b) => b.registrations - a.registrations)
        .slice(0, 20)
        .map((entry, index) => ({
          rank: index + 1,
          ...entry,
        }));
        
    } catch (redisError) {
      console.error("Error computing daily leaderboard:", redisError);
      // Fallback to empty if Redis fails
    }

    return NextResponse.json({
      updatedAt: new Date().toISOString(),
      leaderboard,
      dailyLeaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard data." },
      { status: 500 }
    );
  }
}