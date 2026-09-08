import "server-only";

import { createClient } from "@/lib/supabase/server";

type ScheduleItemDTO = {
  time: string;
  title: string;
  note?: string | null;
};

type GroupedSchedule = {
  day: string;
  dateText: string;
  items: ScheduleItemDTO[];
};

export async function listPublicSchedule() {
  const { data, error } = await (await createClient())
    .from("schedule_items")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("time");

  if (error) {
    throw new Error(error.message);
  }

  const grouped = new Map<string, GroupedSchedule>();

  for (const row of data ?? []) {
    const x: GroupedSchedule =
      grouped.get(row.day) ?? {
        day: row.day,
        dateText: row.date_text,
        items: [] as ScheduleItemDTO[],
      };

    x.items.push({
      time: row.time,
      title: row.title,
      note: row.description,
    });

    grouped.set(row.day, x);
  }

  return [...grouped.values()].map((x, i) => ({
    day: i + 1,
    dateLabel: `${x.dateText} — ${x.day}`,
    items: x.items,
  }));
}

export async function listAdminSchedule() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("schedule_items")
    .select("*")
    .order("sort_order")
    .order("time");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}