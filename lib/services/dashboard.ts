import { createAdminClient } from "@/lib/supabase/admin";
import { requirePermission } from "@/lib/auth/authorize";

export async function getDashboardStats() {
  await requirePermission("dashboard.view");

  const supabase = createAdminClient();

  const [
    events,
    gallery,
    sponsors,
    faqs,
    admins,
    audit,
  ] = await Promise.all([
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("gallery_photos")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("sponsors")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("faqs")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("admin_users")
      .select("id", { count: "exact", head: true })
      .is("deleted_at", null),

    supabase
      .from("audit_logs")
      .select(
        "id, action, entity_type, entity_id, metadata, created_at, actor:actor_id(id,name,email)"
      )
      .order("created_at", { ascending: false })
      .limit(15),
  ]);

  if (audit.error) {
    throw new Error(
      `Failed to load recent activity: ${audit.error.message}`
    );
  }

  const recentActivity = (audit.data ?? []).map((log) => {
    const actor = Array.isArray(log.actor)
      ? log.actor[0] ?? null
      : log.actor ?? null;

    return {
      id: log.id,
      action: log.action,
      entityType: log.entity_type,
      entityId: log.entity_id,
      metadata: log.metadata,
      createdAt: log.created_at,
      actor,
    };
  });

  return {
    eventCount: events.count ?? 0,
    galleryPhotoCount: gallery.count ?? 0,
    sponsorCount: sponsors.count ?? 0,
    faqCount: faqs.count ?? 0,
    adminCount: admins.count ?? 0,
    recentActivity,
  };
}