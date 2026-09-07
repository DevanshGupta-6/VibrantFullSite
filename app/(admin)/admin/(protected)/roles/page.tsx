import { Shield, Plus, Edit2, Trash2, Users, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getRoles, deleteRole } from "./actions"
import { getUsers } from "../users/actions"

export default async function RolesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const params = await searchParams;
  const roles = await getRoles();
  

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Roles & Permissions</h2>
            <p className="text-ink-400 text-sm mt-1">Manage access control and define granular permission matrices.</p>
          </div>
        </div>
        <Link 
          href="/admin/roles/new"
          className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Role
        </Link>
      </div>

      {params.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Role saved successfully.</p>
           </div>
           <Link href="/admin/roles" className="text-green-400 hover:text-green-300 px-2 py-1">
             Dismiss
           </Link>
        </div>
      )}

      <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink-900/50 border-b border-ink-800 text-ink-300">
              <tr>
                <th className="px-6 py-4 font-medium">Role Name</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Users</th>
                <th className="px-6 py-4 font-medium">Permissions</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {roles.map((role: any) => {
                const isSystem = role.code === "SUPER_ADMIN";
                const userCount = role.userCount ?? 0;
                
                return (
                <tr key={role.id} className="hover:bg-ink-900/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSystem ? 'bg-red-500/10 text-red-400' : 'bg-vibeesta-500/10 text-vibeesta-400'}`}>
                        <Shield className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-ink-100">{role.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-ink-400 max-w-[300px] truncate">
                    {role.description}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-ink-300">
                      <Users className="w-4 h-4 text-ink-500" />
                      <span>{userCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-ink-800 border border-ink-700 rounded-full text-xs font-medium text-ink-200">
                      {role.permissions?.length || 0} policies
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/roles/${role.id}/edit`} className="inline-flex p-2 text-ink-400 hover:text-vibeesta-400 hover:bg-vibeesta-500/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      {!isSystem && (
                        <form action={deleteRole.bind(null, role.id)}>
                          <button type="submit" className="inline-flex p-2 text-ink-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}