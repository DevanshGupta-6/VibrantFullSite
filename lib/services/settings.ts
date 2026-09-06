import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function getSiteSettings(){const {data,error}=await (await createClient()).from("site_settings").select("*").eq("id","site").maybeSingle();if(error)throw new Error(error.message);return data;}
export async function getAdminSettings(){const supabase=await createClient();
  const {data,error}=await supabase.from("site_settings").select("*").eq("id","site").maybeSingle();if(error)throw new Error(error.message);return data;}
