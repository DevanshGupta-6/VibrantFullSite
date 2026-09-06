import type { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import CampusAmbassadorLeaderboard from "@/components/CampusAmbassadorLeaderboard";
import CampusAmbassadorEnrollButton from "@/components/CampusAmbassadorEnrollButton";

export const metadata: Metadata = {
  title: `Campus Ambassador | ${siteConfig.seo.title}`,
  description: "View the live referral leaderboard for VIBRANT 2K26 Campus Ambassadors.",
};

export default function CampusAmbassadorPage() {
  return (
    <main id="main" className="pt-36 pb-28 min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.1) 0%, transparent 50%)"
        }}
      />
      
      <div className="container-content flex-grow">
        <div className="text-center mb-16">
          <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-ink-500 mb-4">
            {siteConfig.eventName}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-black tracking-tight">
            CAMPUS <span className="accent-rule">AMBASSADOR</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-ink-300 text-[13px] sm:text-[14.5px] leading-relaxed px-4">
            Invite your peers to experience VIBRANT 2K26. The top referrers will earn exclusive rewards, VIP access, and special recognition during the closing ceremony.
          </p>
          <CampusAmbassadorEnrollButton />
        </div>

        <CampusAmbassadorLeaderboard />
      </div>
    </main>
  );
}