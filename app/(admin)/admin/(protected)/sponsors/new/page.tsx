import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { addSponsor } from "../actions"

export default function NewSponsorPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/sponsors" className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Add Sponsor</h2>
          <p className="text-ink-400 text-sm mt-1">Add a new partner or sponsor to the event.</p>
        </div>
      </div>

      <form action={addSponsor} className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Sponsor Name</label>
            <input name="name" required type="text" placeholder="e.g. Google" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Tier</label>
            <select name="tier" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500">
               <option value="Title Sponsor">Title Sponsor</option>
               <option value="Powered By">Powered By</option>
               <option value="Associate">Associate</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Logo URL</label>
            <input name="logo" required type="url" placeholder="https://..." className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Website URL</label>
            <input name="url" required type="url" placeholder="https://..." className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-ink-800">
           <button type="submit" className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Save Sponsor
           </button>
        </div>
      </form>
    </div>
  )
}