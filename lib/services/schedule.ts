import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
type ScheduleItemDTO={time:string;title:string;note?:string|null};
export async function listPublicSchedule(){const {data,error}=await (await createClient()).from("schedule_items").select("*").eq("published",true).order("sort_order").order("time");if(error)throw new Error(error.message);const grouped=new Map<string,{day:string;dateText:string;items:ScheduleItemDTO[]}>();for(const row of data??[]){const x=grouped.get(row.day)??{day:row.day,dateText:row.date_text,items:[]};x.items.push({time:row.time,title:row.title,note:row.description});grouped.set(row.day,x);}return [...grouped.values()].map((x,i)=>({day:i+1,dateLabel:`${x.dateText} — ${x.day}`,items:x.items}));}
export async function listAdminSchedule(){const {data,error}=await createAdminClient().from("schedule_items").select("*").order("sort_order").order("time");if(error)throw new Error(error.message);return data??[];}
