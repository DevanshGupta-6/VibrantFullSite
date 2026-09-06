import AdminLayoutShell from "@/components/admin/AdminLayoutShell";
import { requireAuth } from "@/lib/auth/session";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAuth();
  return <AdminLayoutShell admin={{ name: admin.name, email: admin.email, role: admin.role.name }}>{children}</AdminLayoutShell>;
}
