import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import { requireAuth } from "@/lib/auth/session";

export default function AdminRouteGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}