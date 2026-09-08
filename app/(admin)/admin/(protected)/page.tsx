import { Users, Calendar, Image as ImageIcon, Briefcase, Shield } from "lucide-react";
import Link from "next/link";
import { requirePermission } from "@/lib/auth/authorize";
import { getDashboardStats } from "@/lib/services/dashboard";

export default async function AdminDashboard() {
  const statsData = await getDashboardStats();
 const admin = await requirePermission("dashboard.view");

const stats = [
  {
    title: "Total Users",
    value: String(statsData.adminCount),
    icon: Users,
    href: "/admin/users",
    permission: "users.view" as const,
  },
  {
    title: "Active Events",
    value: String(statsData.eventCount),
    icon: Calendar,
    href: "/admin/events",
    permission: "events.view" as const,
  },
  {
    title: "Gallery Items",
    value: String(statsData.galleryPhotoCount),
    icon: ImageIcon,
    href: "/admin/gallery",
    permission: "gallery.view" as const,
  },
  {
    title: "Sponsors",
    value: String(statsData.sponsorCount),
    icon: Briefcase,
    href: "/admin/sponsors",
    permission: "sponsors.view" as const,
  },
].filter((card) => admin.permissions.includes(card.permission));
  return <div className="space-y-8"><div className="flex flex-col gap-2"><h2 className="text-3xl font-display font-bold">Welcome back</h2><p className="text-ink-400">Here's what's happening with VIBRANT 2K26 today.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{stats.map((stat)=><Link key={stat.title} href={stat.href} className="block group"><div className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 transition-all hover:border-vibeesta-500/50 hover:bg-ink-900/30"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-ink-400 mb-1">{stat.title}</p><p className="text-3xl font-display font-bold text-ink-0">{stat.value}</p></div><div className="p-3 bg-ink-900 rounded-lg"><stat.icon className="w-6 h-6 text-ink-400"/></div></div></div></Link>)}</div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2 bg-[#0B0A10] border border-ink-800 rounded-xl p-6"><div className="flex items-center justify-between mb-6"><h3 className="font-semibold text-lg text-ink-100">Recent Activity</h3><Link href="/admin/audit" className="text-sm text-vibeesta-400">View all</Link></div><div className="space-y-5">{statsData.recentActivity.map((log)=><div key={log.id} className="flex gap-4"><div className="mt-1"><div className="w-2 h-2 rounded-full bg-vibeesta-500 ring-4 ring-ink-900"/></div><div><p className="text-sm text-ink-100"><span className="font-medium text-vibeesta-400">{log.actor?.name ?? "System"}</span> {log.action}{log.entityType ? ` in ${log.entityType}` : ""}</p><p className="text-xs text-ink-500 mt-1">{new Date(log.createdAt).toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "medium",
})}</p></div></div>)}</div></div>
    <div className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6"><h3 className="font-semibold text-lg text-ink-100 mb-6">Quick Actions</h3><div className="space-y-3"><Link href="/admin/events/new" className="block p-3 rounded-lg bg-ink-900/50 border border-ink-800 text-sm font-medium text-ink-100">Add New Event</Link><Link href="/admin/users/new" className="block p-3 rounded-lg bg-ink-900/50 border border-ink-800 text-sm font-medium text-ink-100">Invite Team Member</Link><Link href="/admin/roles/new" className="block p-3 rounded-lg bg-ink-900/50 border border-ink-800 text-sm font-medium text-ink-100">Create Role Matrix</Link></div></div></div></div>;
}
