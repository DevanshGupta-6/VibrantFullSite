import { Redis } from "@upstash/redis";
import CampusAmbassadorAdminDashboard from "@/components/CampusAmbassadorAdminDashboard";

export const dynamic = "force-dynamic";

interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}

export default async function CampusAmbassadorAdminPage() {
  let ambassadors: Ambassador[] = [];

  try {
    const redis = Redis.fromEnv();
    const data = await redis.get<Ambassador[]>("ambassadors");
    if (data && Array.isArray(data)) {
      ambassadors = data;
    }
  } catch (error) {
    console.error("Failed to fetch ambassadors from Redis:", error);
  }

  // Sort by enrolledAt descending (newest first)
  ambassadors.sort((a, b) => {
    return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
  });

  return (
    <main className="pt-36 pb-28 min-h-screen flex flex-col relative overflow-hidden bg-base-950">
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 50%)"
        }}
      />
      <div className="container-content flex-grow max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white mb-2">
            AMBASSADOR <span className="text-vibeesta-400">ADMIN</span>
          </h1>
          <p className="text-ink-300">
            Confidential dashboard to view all live enrollments from Upstash Redis.
          </p>
        </div>

        <CampusAmbassadorAdminDashboard data={ambassadors} />
      </div>
    </main>
  );
}