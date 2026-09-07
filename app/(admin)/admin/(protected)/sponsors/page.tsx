import { getSponsors, addDummySponsor, deleteSponsor } from "./actions"
import Link from "next/link"
import { ArrowLeft, Edit2, Trash2 } from "lucide-react"
import { requirePermission } from "@/lib/auth/authorize";

export default async function SponsorsPage() {
  const sponsors = await getSponsors();

  const admin = await requirePermission("sponsors.view")
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Sponsors</h2>
            <p className="text-ink-400 text-sm mt-1">Manage event partners and sponsors.</p>
          </div>
        </div>
        <Link href="/admin/sponsors/new" className="bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit">
          Add Sponsor
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {sponsors.map((s: any) => (
           <div key={s.id} className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 flex flex-col items-center text-center group">
              <div className="h-16 flex items-center justify-center mb-4">
                 <img src={s.logo} alt={s.name} className="max-h-full max-w-[120px] object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="font-semibold text-lg text-ink-100">{s.name}</h3>
              <p className="text-ink-400 text-xs uppercase tracking-wider font-semibold mt-1">{s.tier}</p>
              
              <div className="flex items-center gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                {admin.permissions.includes("sponsors.edit") && (
                 <Link href={`/admin/sponsors/${s.id}/edit`} className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-400 hover:text-vibeesta-400 hover:border-vibeesta-500/30 transition-colors">
                   <Edit2 className="w-4 h-4" />
                 </Link>
                )}
                {admin.permissions.includes("sponsors.delete") && (
                 <form action={deleteSponsor.bind(null, s.id)}>
                   <button type="submit" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </form>
                )}
              </div>
           </div>
         ))}
         
         {sponsors.length === 0 && (
           <div className="col-span-full bg-[#0B0A10] border border-ink-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-ink-900 rounded-full flex items-center justify-center mb-4">
                 <svg className="w-8 h-8 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
              </div>
              <h3 className="text-xl font-semibold text-ink-100">No Sponsors Yet</h3>
              <p className="text-ink-400 mt-2 max-w-sm">You haven't added any sponsors. Click the button above to add your first partner.</p>
           </div>
         )}
      </div>
    </div>
  )
}