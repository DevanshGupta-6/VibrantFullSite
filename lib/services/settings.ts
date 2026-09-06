import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function getSiteSettings(){const {data,error}=await (await createClient()).from("site_settings").select("*").eq("id","site").maybeSingle();if(error)throw new Error(error.message);return data;}
export async function getAdminSettings(){const {data,error}=await createAdminClient().from("site_settings").select("*").eq("id","site").maybeSingle();if(error)throw new Error(error.message);return data;}
