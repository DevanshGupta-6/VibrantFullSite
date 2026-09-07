import { Plus, Clock, Edit2, Trash2, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getSchedule, deleteSchedule } from "./actions"

export default async function AdminSchedulePage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string;
    day?: string;
  }>;
}) {
  const params = await searchParams;

  const allSchedule = await getSchedule();

  const uniqueDays = Array.from(
    new Set<string>(
      allSchedule.map((s: any) => s.day as string)
    )
  );

  const activeDay =
    params.day ||
    (uniqueDays.length > 0 ? uniqueDays[0] : "Day 1");

  const filteredSchedule = allSchedule.filter(
    (s: any) => s.day === activeDay
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-300 hover:text-ink-0 hover:bg-ink-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-display font-bold">Schedule</h2>
            <p className="text-ink-400 text-sm mt-1">Manage the master itinerary for the fest.</p>
          </div>
        </div>
        <Link href="/admin/schedule/new" className="flex items-center gap-2 bg-vibeesta-500 hover:bg-vibeesta-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-fit">
          <Plus className="w-4 h-4" />
          Add Slot
        </Link>
      </div>
      
      {params.success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center justify-between">
           <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Action completed successfully.</p>
           </div>
           <Link href="/admin/schedule" className="text-green-400 hover:text-green-300 px-2 py-1">
             Dismiss
           </Link>
        </div>
      )}

      <div className="bg-[#0B0A10] border border-ink-800 rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar with dynamic tabs */}
        <div className="p-4 border-b border-ink-800 flex flex-col sm:flex-row gap-4 justify-between bg-ink-900/20">
           <div className="flex flex-wrap gap-2">
              {uniqueDays.length === 0 && (
                <span className="text-sm text-ink-500">No days added yet.</span>
              )}
              {uniqueDays.map((dayName: any) => (
                <Link 
                  key={dayName}
                  href={`/admin/schedule?day=${dayName}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    activeDay === dayName 
                      ? 'bg-vibeesta-500/10 text-vibeesta-400 border-vibeesta-500/20' 
                      : 'bg-ink-900 text-ink-300 border-ink-800 hover:bg-ink-800'
                  }`}
                >
                  {dayName}
                </Link>
              ))}
           </div>
        </div>

        <div className="divide-y divide-ink-800">
           {filteredSchedule.length === 0 ? (
             <div className="p-12 text-center text-ink-500">
               No schedule slots found for {activeDay}.
             </div>
           ) : filteredSchedule.map((slot: any) => (
             <div key={slot.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-ink-900/30 transition-colors group">
               <div className="flex items-center gap-2 text-poster-cyan font-display font-bold w-32 shrink-0">
                 <Clock className="w-4 h-4" />
                 {slot.time}
               </div>
               <div className="flex-1">
                 <h4 className="text-lg font-semibold text-ink-0">{slot.title}</h4>
                 <div className="text-sm text-ink-400 mt-1">
                   {slot.description}
                 </div>
               </div>
               <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link href={`/admin/schedule/${slot.id}/edit`} className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-400 hover:text-vibeesta-400 hover:border-vibeesta-500/30 transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <form action={deleteSchedule.bind(null, slot.id)}>
                    <button type="submit" className="p-2 bg-ink-900 border border-ink-800 rounded-lg text-ink-400 hover:text-red-400 hover:border-red-500/30 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
               </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}