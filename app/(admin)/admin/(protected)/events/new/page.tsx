import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { addEvent } from "../actions";
import RoleForm from "@/components/admin/RoleForm";
import { requirePermission } from "@/lib/auth/authorize";

export default async function NewEventPage() {
  await requirePermission("roles.create");
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="p-2 rounded-lg bg-ink-900 hover:bg-ink-800 transition-colors text-ink-300 hover:text-ink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div>
          <h2 className="text-2xl font-display font-bold">Add Event</h2>
          <p className="text-ink-400 text-sm mt-1">
            Create a new tech or creative event.
          </p>
        </div>
      </div>

      <form
        action={addEvent}
        className="space-y-8 bg-[#0B0A10] border border-ink-800 rounded-xl p-6 md:p-8 shadow-2xl shadow-black/50"
      >
        {/* ==================== BASIC INFORMATION ==================== */}
        <div className="space-y-5">
          <div>
            <h3 className="text-base font-semibold text-ink-100">
              Basic Information
            </h3>
            <p className="text-xs text-ink-500 mt-1">
              Set the event name, category, tagline, and description.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Event Name
              </label>

              <input
                name="name"
                required
                type="text"
                placeholder="e.g. 36-Hour Hackathon"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Category
              </label>

              <select
                name="category"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              >
                <option value="tech">Tech</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* ==================== TAGLINE ==================== */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Event Tagline
              </label>

              <input
                name="tagline"
                type="text"
                maxLength={200}
                placeholder="e.g. BUILD. BREAK. INNOVATE."
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />

              <p className="text-xs text-ink-600">
                A short poster-style line for the event.
              </p>
            </div>

            {/* ==================== DESCRIPTION ==================== */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Event Description
              </label>

              <textarea
                name="description"
                rows={5}
                maxLength={5000}
                placeholder="Describe the event, what participants will do, and what makes it unique."
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 resize-y"
              />

              <p className="text-xs text-ink-600">
                Up to 5000 characters.
              </p>
            </div>
          </div>
        </div>

        {/* ==================== EVENT DETAILS ==================== */}
        <div className="border-t border-ink-800 pt-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-ink-100">
              Event Details
            </h3>
            <p className="text-xs text-ink-500 mt-1">
              Schedule, participation, venue, rules, and coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Date
              </label>

              <input
                name="date"
                type="text"
                placeholder="e.g. 17 Oct"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Time
              </label>

              <input
                name="time"
                type="text"
                placeholder="e.g. 10:00 AM"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Team Size */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Team Size
              </label>

              <input
                name="teamSize"
                type="text"
                placeholder="e.g. Individual / Groups"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Venue */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Venue
              </label>

              <input
                name="venue"
                type="text"
                placeholder="e.g. Main Stage"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Fee */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Fee
              </label>

              <input
                name="fee"
                type="text"
                placeholder="e.g. Free / ₹199"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Prize */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Prize
              </label>

              <input
                name="prize"
                type="text"
                placeholder="e.g. ₹50,000"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Eligibility */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Eligibility
              </label>

              <input
                name="eligibility"
                type="text"
                placeholder="e.g. Open to students from all colleges."
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              />
            </div>

            {/* Rules */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Rules
              </label>

              <textarea
                name="rules"
                placeholder="Add one rule per line."
                rows={4}
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 resize-y"
              />
            </div>

            {/* Coordinators */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Coordinators
              </label>

              <textarea
                name="coordinators"
                placeholder="e.g. John Doe, Jane Doe"
                rows={2}
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 resize-y"
              />
            </div>
          </div>
        </div>

        {/* ==================== CONTACT & PUBLISHING ==================== */}
        <div className="border-t border-ink-800 pt-6 space-y-5">
          <div>
            <h3 className="text-base font-semibold text-ink-100">
              Contact & Publishing
            </h3>

            <p className="text-xs text-ink-500 mt-1">
              Add the public contact information participants should use for
              this event.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ==================== CONTACT ==================== */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-ink-300">
                Contact Details
              </label>

              <textarea
                name="contact"
                rows={3}
                maxLength={500}
                placeholder="e.g. Event Coordinator: Akash — +91 98765 43210 — hackathon@vibrant2k26.in"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 resize-y"
              />

              <p className="text-xs text-ink-600">
                You can enter phone numbers, email addresses, or multiple
                contact details.
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-300">
                Status
              </label>

              <select
                name="status"
                defaultValue="Draft"
                className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* ==================== SAVE ==================== */}
        <div className="flex justify-end pt-4 border-t border-ink-800">
          <button
            type="submit"
            className="flex items-center gap-2 bg-vibeesta-600 hover:bg-vibeesta-500 text-white px-8 py-3 rounded-lg text-sm font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Event
          </button>
        </div>
      </form>
      <RoleForm action={addEvent} />
    </div>
  );
}