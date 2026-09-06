"use client";

import { useState } from "react";
import useSWR from "swr";
import { Trophy, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  referralCode: string;
  registrations: number;
}

interface LeaderboardData {
  updatedAt: string;
  leaderboard: LeaderboardEntry[];
  dailyLeaderboard: LeaderboardEntry[];
  error?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CampusAmbassadorLeaderboard() {
  const [view, setView] = useState<"allTime" | "daily">("allTime");
  const { data, error, isLoading } = useSWR<LeaderboardData>(
    "/api/campus-ambassador/leaderboard",
    fetcher,
    { refreshInterval: 30000 }
  );

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-[#FFD700] border-[#FFD700]/30 bg-[#FFD700]/10 font-black"; // Gold
      case 2:
        return "text-[#C0C0C0] border-[#C0C0C0]/30 bg-[#C0C0C0]/10 font-bold"; // Silver
      case 3:
        return "text-[#CD7F32] border-[#CD7F32]/30 bg-[#CD7F32]/10 font-bold"; // Bronze
      default:
        return "text-ink-0 border-ink-700/20";
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy size={20} className="text-[#FFD700] mx-auto" />;
      case 2:
        return <Trophy size={18} className="text-[#C0C0C0] mx-auto" />;
      case 3:
        return <Trophy size={18} className="text-[#CD7F32] mx-auto" />;
      default:
        return <span className="font-display font-bold text-ink-300">{rank}</span>;
    }
  };

  if (error || data?.error) {
    return (
      <div className="p-8 border border-shrinik-600/30 bg-shrinik-900/20 text-center rounded-lg">
        <AlertCircle className="mx-auto text-shrinik-600 mb-3" size={32} />
        <h3 className="font-display font-semibold text-ink-0 text-lg mb-2">
          Could not load leaderboard
        </h3>
        <p className="text-ink-300 text-sm">
          There was an error fetching the live data. Please try again later.
        </p>
      </div>
    );
  }

  const activeLeaderboard = view === "allTime" 
    ? data?.leaderboard 
    : data?.dailyLeaderboard;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold">
          TOP 20 <span className="accent-rule">AMBASSADORS</span>
        </h2>
        
        <div className="flex items-center gap-2 text-ink-500 text-xs">
          {isLoading && !data ? (
            <span className="flex items-center gap-1.5 font-semibold tracking-wider uppercase">
              <RefreshCw size={12} className="animate-spin" /> Loading
            </span>
          ) : (
            <span className="flex items-center gap-1.5 tracking-wider uppercase font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vibeesta-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-vibeesta-500"></span>
              </span>
              Live Updates
            </span>
          )}
        </div>
      </div>

      {/* Toggle UI */}
      <div className="flex justify-center mb-8">
        <div className="bg-base-900/50 backdrop-blur-md border border-ink-700/30 p-1 rounded-full inline-flex relative shadow-lg">
          <div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-vibeesta-600/20 border border-vibeesta-500/50 rounded-full transition-all duration-300 ease-in-out z-0"
            style={{ left: view === "allTime" ? "4px" : "calc(50%)" }}
          />
          <button
            onClick={() => setView("allTime")}
            className={`relative z-10 px-6 py-2 text-sm font-semibold tracking-wider uppercase transition-colors rounded-full ${
              view === "allTime" ? "text-vibeesta-400" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => setView("daily")}
            className={`relative z-10 px-6 py-2 text-sm font-semibold tracking-wider uppercase transition-colors rounded-full ${
              view === "daily" ? "text-vibeesta-400" : "text-ink-400 hover:text-ink-200"
            }`}
          >
            1-Day Winner
          </button>
        </div>
      </div>

      <div className="bg-base-900 border border-ink-700/20 rounded-xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 fusion-gradient opacity-80" />
        
        <div className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-4 text-[9px] sm:text-[11px] font-semibold tracking-[0.1em] sm:tracking-[0.16em] uppercase text-ink-500 border-b border-ink-700/20">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-7">Referral Code</div>
          <div className="col-span-3 text-right">Registrations</div>
        </div>

        {isLoading && !data ? (
          <div className="flex flex-col">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-5 items-center border-b border-ink-700/10 last:border-0 animate-pulse">
                <div className="col-span-2 mx-auto h-5 w-5 sm:h-6 sm:w-6 bg-ink-700/20 rounded-full" />
                <div className="col-span-7 h-4 sm:h-5 w-24 sm:w-32 bg-ink-700/20 rounded" />
                <div className="col-span-3 ml-auto h-4 sm:h-5 w-8 sm:w-12 bg-ink-700/20 rounded" />
              </div>
            ))}
          </div>
        ) : activeLeaderboard && activeLeaderboard.length > 0 ? (
          <div className="flex flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial={{ opacity: 0, x: view === "allTime" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: view === "allTime" ? 20 : -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeLeaderboard.map((entry, i) => (
                  <div
                    key={entry.referralCode}
                    className={`grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-5 items-center border-b last:border-0 transition-colors hover:bg-white/[0.02] ${getRankStyle(entry.rank)}`}
                  >
                    <div className="col-span-2 text-center flex justify-center scale-90 sm:scale-100">
                      {getRankBadge(entry.rank)}
                    </div>
                    <div className="col-span-7 font-display tracking-wider sm:tracking-widest text-[13px] sm:text-[15px] md:text-lg truncate">
                      {entry.referralCode}
                    </div>
                    <div className="col-span-3 text-right font-display text-[13px] sm:text-[15px] md:text-lg">
                      {entry.registrations}
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="p-12 text-center text-ink-500">
            <Trophy size={48} className="mx-auto text-ink-700/30 mb-4" />
            <p className="font-display tracking-wider uppercase mb-1">No registrations yet</p>
            <p className="text-sm">
              {view === "daily" 
                ? "The race for today just started! Be the first to get a registration." 
                : "Be the first to share your referral code!"}
            </p>
          </div>
        )}
      </div>

      {data?.updatedAt && (
        <div className="text-right mt-3 text-[10px] text-ink-700 font-mono">
          LAST SYNC: {new Date(data.updatedAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}