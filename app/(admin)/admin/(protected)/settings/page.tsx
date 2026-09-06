import { Save, Globe, Info, Link2, ArrowLeft, CheckCircle } from "lucide-react"
import { getSettings, saveSettings } from "./actions"
import Link from "next/link"

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string } }) {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Site Settings</h2>
          <p className="text-ink-400 text-sm mt-1">Manage global configuration, dates, and registration links.</p>
        </div>
      </div>

      {searchParams.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Settings saved successfully. Changes are now live.</p>
           </div>
           <Link href="/admin/settings" className="text-green-400 hover:text-green-300 px-2 py-1">
             Dismiss
           </Link>
        </div>
      )}

      <form action={saveSettings} className="space-y-8">
         {/* General Settings */}
         <div className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-ink-800 pb-4 mb-6">
               <Info className="w-5 h-5 text-poster-cyan" />
               <h3 className="font-semibold text-lg text-ink-100">General Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-300">Event Name</label>
                  <input name="eventName" type="text" defaultValue={settings.eventName} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-poster-cyan focus:ring-1 focus:ring-poster-cyan transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-300">Tagline</label>
                  <input name="tagline" type="text" defaultValue={settings.tagline} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-poster-cyan focus:ring-1 focus:ring-poster-cyan transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-300">Dates Label</label>
                  <input name="datesLabel" type="text" defaultValue={settings.datesLabel} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-poster-cyan focus:ring-1 focus:ring-poster-cyan transition-all" />
               </div>
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-300">Venue</label>
                  <input name="venue" type="text" defaultValue={settings.venue} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-poster-cyan focus:ring-1 focus:ring-poster-cyan transition-all" />
               </div>
            </div>
         </div>

         {/* Registration & Links */}
         <div className="bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 border-b border-ink-800 pb-4 mb-6">
               <Link2 className="w-5 h-5 text-vibeesta-400" />
               <h3 className="font-semibold text-lg text-ink-100">Registration & Links</h3>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-sm font-medium text-ink-300">Registration URL</label>
                  <div className="flex">
                     <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-ink-800 bg-ink-900 text-ink-400 text-sm">
                        <Globe className="w-4 h-4" />
                     </span>
                     <input name="registrationUrl" type="url" defaultValue={settings.registrationUrl} placeholder="https://forms.gle/..." className="flex-1 bg-[#07070B] border border-ink-800 rounded-r-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all" />
                  </div>
                  <p className="text-xs text-ink-500 mt-1.5">Leaving this blank will disable registration buttons across the site.</p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-ink-300">Instagram URL</label>
                     <input name="instagramUrl" type="url" defaultValue={settings.instagramUrl} placeholder="https://instagram.com/..." className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium text-ink-300">LinkedIn URL</label>
                     <input name="linkedinUrl" type="url" defaultValue={settings.linkedinUrl} placeholder="https://linkedin.com/..." className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all" />
                  </div>
               </div>
            </div>
         </div>

         <div className="flex justify-end">
            <button type="submit" className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-vibeesta-900/20">
               <Save className="w-4 h-4" />
               Save Settings
            </button>
         </div>
      </form>
    </div>
  )
}