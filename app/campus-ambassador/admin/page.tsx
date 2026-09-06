import { campusAmbassadorRedis } from "@/lib/campusAmbassador/redis";
import CampusAmbassadorAdminDashboard from "@/components/CampusAmbassadorAdminDashboard";
import { requirePermission } from "@/lib/auth/authorize";

export const dynamic = "force-dynamic";

interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}

interface Ambassador {
  name: string;
  contact: string;
  branch: string;
  code: string;
  enrolledAt: string;
}

type AmbassadorRedisRecord = Record<string, string>;

async function getAmbassadors(): Promise<Ambassador[]> {
  const codes = await campusAmbassadorRedis.smembers(
    "ca:ambassadors"
  );

  if (!codes.length) {
    return [];
  }

  const records = await Promise.all(
    codes.map(async (code) => {
      const ambassador =
        await campusAmbassadorRedis.hgetall<AmbassadorRedisRecord>(
          `ca:ambassador:${code}`
        );

      if (
        !ambassador ||
        !ambassador.code ||
        !ambassador.name
      ) {
        return null;
      }

      return {
        name: ambassador.name,
        contact: ambassador.contact,
        branch: ambassador.branch,
        code: ambassador.code,
        enrolledAt: ambassador.enrolledAt,
      };
    })
  );

  return records
    .filter(
      (item): item is Ambassador =>
        item !== null
    )
    .sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() -
        new Date(a.enrolledAt).getTime()
    );
}

export default async function CampusAmbassadorAdminPage() {
  /*
   * Authorization is checked before reading Redis.
   */
  await requirePermission("campus_ambassador.view");

  const ambassadors = await getAmbassadors();

  return (
    <main className="pt-36 pb-28 min-h-screen flex flex-col relative overflow-hidden bg-base-950">
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(124,58,237,0.15) 0%, transparent 50%)",
        }}
      />

      <div className="container-content flex-grow max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white mb-2">
            AMBASSADOR{" "}
            <span className="text-vibeesta-400">
              ADMIN
            </span>
          </h1>

          <p className="text-ink-300">
            Confidential dashboard to view campus ambassador enrollments.
          </p>
        </div>

        <CampusAmbassadorAdminDashboard
          data={ambassadors}
        />
      </div>
    </main>
  );
}