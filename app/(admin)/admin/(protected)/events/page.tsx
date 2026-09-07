import { Plus, Search, Filter, Edit2, Trash2, ArrowLeft, CheckCircle, Calendar as CalendarIcon, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { getEvents, deleteEvent } from "./actions"
import { requirePermission } from "@/lib/auth/authorize";

export default async function AdminEventsPage({ searchParams }: { searchParams: { success?: string, category?: string } }) {
  const params = await searchParams;
  let events = await getEvents();
  const admin = await requirePermission("events.view");
  
  if (params.category) {
    events = events.filter((e: any) => e.category === params.category);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Events</h2>
            <p className="text-ink-400 text-sm mt-1">Manage fest events, schedules, and capacities.</p>
          </div>
        </div>
        
        <Link href="/admin/events/new" className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      {params.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Action completed successfully.</p>
           </div>
           <Link href={`/admin/events${params.category ? `?category=${params.category}` : ''}`} className="text-green-400 hover:text-green-300 px-2 py-1">
             Dismiss
           </Link>
        </div>
      )}

      <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-4 justify-between bg-ink-900/20">
           <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
              <input 
                type="text" 
                placeholder="Search events..."
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg pl-10 pr-4 py-2 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-vibeesta-500 focus:ring-1 focus:ring-vibeesta-500 transition-all"
              />
           </div>
           <div className="flex gap-2">
             <Link href="/admin/events" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!params.category ? 'bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20' : 'bg-ink-900 border border-ink-800 text-ink-300'}`}>
               All
             </Link>
             <Link href="/admin/events?category=tech" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${params.category === 'tech' ? 'bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20' : 'bg-ink-900 border border-ink-800 text-ink-300'}`}>
               Tech
             </Link>
             <Link href="/admin/events?category=creative" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${params.category === 'creative' ? 'bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20' : 'bg-ink-900 border border-ink-800 text-ink-300'}`}>
               Creative
             </Link>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-ink-900/50 border-b border-ink-800 text-ink-400 font-medium">
              <tr>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Schedule & Venue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-800">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-ink-400">
                    No events found.
                  </td>
                </tr>
              ) : events.map((event: any) => (
                <tr key={event.id} className="hover:bg-ink-900/30 transition-colors group">
                  <td className="px-6 py-4">
                     <p className="font-semibold text-ink-100">{event.name}</p>
                     {event.teamSize && <p className="text-xs text-ink-500 mt-1 flex items-center gap-1"><Users className="w-3 h-3"/> {event.teamSize}</p>}
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${
                        event.category === 'tech' ? 'bg-shrinik-500/10 text-shrinik-400 border border-shrinik-500/20' : 'bg-vibeesta-500/10 text-vibeesta-400 border border-vibeesta-500/20'
                     }`}>
                        {event.category}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-ink-300 text-xs">
                           <CalendarIcon className="w-3.5 h-3.5 text-ink-500" />
                           {event.date || 'TBA'} • {event.time || 'TBA'}
                        </div>
                        <div className="flex items-center gap-1.5 text-ink-400 text-xs">
                           <MapPin className="w-3.5 h-3.5 text-ink-600" />
                           {event.venue || 'TBA'}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wider ${
                       event.status === 'Published' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                       }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <div className="flex items-center justify-end gap-2">
                      {admin.permissions.includes("events.edit") && (
                      <Link href={`/admin/events/${event.id}/edit`} className="inline-flex p-2 text-ink-400 hover:text-vibeesta-400 hover:bg-vibeesta-400/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      )}
                      {admin.permissions.includes("users.delete") &&(
                      <form action={deleteEvent.bind(null, event.id)}>
                        <button type="submit" className="inline-flex p-2 text-ink-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}