import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { getUsers, updateUser } from "../../actions"
import { getRoles } from "../../../roles/actions"
import { getEvents } from "../../../events/actions"
import PasswordGenerator from "@/components/admin/PasswordGenerator"
import { notFound } from "next/navigation"
import RoleForm from "@/components/admin/RoleForm";
import { requirePermission } from "@/lib/auth/authorize";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requirePermission("users.edit")

  const users = await getUsers()
  const user = users.find((u: any) => u.id === id)

  if (!user) {
    notFound()
  }

  const roles = await getRoles()
  const events = await getEvents()

  const updateUserWithId = updateUser.bind(null, id)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Edit User</h2>
          <p className="text-ink-400 text-sm mt-1">Update team member details and roles.</p>
        </div>
      </div>

      <form action={updateUserWithId} className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Name</label>
            <input name="name" required type="text" defaultValue={user.name} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Email</label>
            <input name="email" required type="email" defaultValue={user.email} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <PasswordGenerator required={false}/>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-300">Role</label>
            <select name="roleId" defaultValue={user.role?.id || ""} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500">
               {roles.map((role: any) => (
                 <option key={role.id} value={role.id}>{role.name}</option>
               ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-300">Account Status</label>
            <select name="status" defaultValue={user.status} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500">
              <option value="ACTIVE">Active</option>
              <option value="DISABLED">Disabled</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-300">Scope (Event Assignment) <span className="text-ink-500 font-normal">(Optional)</span></label>
            <select name="scope" defaultValue={user.scope || "Global"} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500">
              <option value="Global">Global (All Events/System)</option>
              {events.map((event: any) => (
                <option key={event.id} value={event.name}>{event.name}</option>
              ))}
            </select>
            <p className="text-xs text-ink-500">Assign this user to a specific event or give them global access.</p>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-ink-800">
           <button type="submit" className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </form>
      <RoleForm action={updateUser} />
    </div>
  )
}