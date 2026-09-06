import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { getSchedule, updateSchedule } from "../../actions"
import ScheduleDaySelector from "@/components/admin/ScheduleDaySelector"
import { notFound } from "next/navigation"

export default async function EditSchedulePage({ params }: { params: { id: string } }) {
  const schedule = await getSchedule();
  const slot = schedule.find((s: any) => s.id === params.id);
  
  if (!slot) {
    notFound();
  }

  // Extract unique days with their dates
  const uniqueDaysMap = new Map();
  schedule.forEach((s: any) => {
    if (!uniqueDaysMap.has(s.day)) {
      uniqueDaysMap.set(s.day, s.dateText);
    }
  });
  const existingDays = Array.from(uniqueDaysMap.entries()).map(([day, dateText]) => ({ day, dateText }));

  const updateScheduleWithId = updateSchedule.bind(null, params.id);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/schedule" className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-display font-bold">Edit Schedule Slot</h2>
          <p className="text-ink-400 text-sm mt-1">Update this event's itinerary details.</p>
        </div>
      </div>

      <form action={updateScheduleWithId} className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ScheduleDaySelector existingDays={existingDays} defaultDay={slot.day} defaultDate={slot.dateText} />

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Time (e.g., 09:30)</label>
            <input name="time" required type="text" defaultValue={slot.time} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Title / Event Name</label>
            <input name="title" required type="text" defaultValue={slot.title} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-ink-300">Description</label>
            <textarea name="description" required rows={3} defaultValue={slot.description} className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500 resize-y" />
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t border-ink-800">
           <button type="submit" className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors">
              <Save className="w-4 h-4" /> Save Changes
           </button>
        </div>
      </form>
    </div>
  )
}