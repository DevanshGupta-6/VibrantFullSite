"use client";

import { useState } from "react";

export default function ScheduleDaySelector({ 
  existingDays, 
  defaultDay = "", 
  defaultDate = "" 
}: { 
  existingDays: { day: string, dateText: string }[], 
  defaultDay?: string, 
  defaultDate?: string 
}) {
  const [isNew, setIsNew] = useState(false);
  const [selectedDay, setSelectedDay] = useState(defaultDay || existingDays[0]?.day || "");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "new") {
      setIsNew(true);
    } else {
      setIsNew(false);
      setSelectedDay(e.target.value);
    }
  };

  const selectedDate = existingDays.find(d => d.day === selectedDay)?.dateText || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-300">Select Day</label>
        <select 
          onChange={handleSelectChange} 
          defaultValue={defaultDay ? (existingDays.some(d => d.day === defaultDay) ? defaultDay : "new") : existingDays[0]?.day}
          className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500"
        >
          {existingDays.map((d, i) => (
            <option key={i} value={d.day}>{d.day} - {d.dateText}</option>
          ))}
          <option value="new">+ Add New Day</option>
        </select>
      </div>

      {isNew ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Custom Day Name</label>
            <input name="day" required type="text" placeholder="e.g. Day 3" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-300">Custom Date Text</label>
            <input name="dateText" required type="text" placeholder="e.g. 18 October" className="w-full bg-[#07070B] border border-ink-800 rounded-lg px-4 py-2.5 text-sm text-ink-100 focus:outline-none focus:border-vibeesta-500" />
          </div>
        </>
      ) : (
        <>
          <input type="hidden" name="day" value={selectedDay} />
          <input type="hidden" name="dateText" value={selectedDate} />
        </>
      )}
    </div>
  );
}