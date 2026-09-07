import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import RoleForm from "@/components/admin/RoleForm"
import { getRoles, updateRole } from "../../actions"
import { notFound } from "next/navigation"

export default async function EditRolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const roles = await getRoles();
  const role = roles.find((r: any) => r.id === id);
  
  if (!role) {
    notFound();
  }

  const updateRoleWithId = updateRole.bind(null, id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/roles" className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Edit Role: {role.name}</h2>
          <p className="text-ink-400 text-sm mt-1">Update this role's permissions matrix.</p>
        </div>
      </div>

      <RoleForm initialData={role} action={updateRoleWithId} />
    </div>
  )
}