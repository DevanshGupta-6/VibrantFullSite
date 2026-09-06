import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { FestEvent } from "@/lib/types";
export function toFestEvent(e:any):FestEvent{return {id:e.id,number:e.number,name:e.name,category:e.category,tagline:e.tagline??"",description:e.description,date:e.date,time:e.time,venue:e.venue,teamSize:e.team_size,eligibility:e.eligibility,rules:e.rules??[],prize:e.prize,fee:e.fee,coordinators:e.coordinators,contact:e.contact,image:e.image,status:e.published?"Published":"Draft"} as FestEvent;}
export async function listPublicEvents():Promise<FestEvent[]>{const {data,error}=await (await createClient()).from("events").select("*").eq("published",true).is("deleted_at",null).order("sort_order",{ascending:true}).order("number",{ascending:true});if(error)throw new Error(error.message);return (data??[]).map(toFestEvent);}
export async function listAdminEvents(){const {data,error}=await createAdminClient().from("events").select("*").is("deleted_at",null).order("sort_order",{ascending:true}).order("number",{ascending:true});if(error)throw new Error(error.message);return (data??[]).map(toFestEvent);}
export async function getEvent(id:string){const {data,error}=await createClient().from("events").select("*").eq("id",id).is("deleted_at",null).maybeSingle();if(error)throw new Error(error.message);return data?toFestEvent(data):null;}
