import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Sponsor } from "@/lib/types";
export async function listPublicSponsors():Promise<Sponsor[]>{const {data,error}=await (await createClient()).from("sponsors").select("id,name,tier,logo,url").eq("published",true).is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data as Sponsor[];}
export async function listAdminSponsors(){const supabase=await createClient();
  const {data,error}=await supabase.from("sponsors").select("*").is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data??[];}
