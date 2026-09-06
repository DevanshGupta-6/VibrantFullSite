import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function listPublicFaq(){const {data,error}=await (await createClient()).from("faqs").select("id,question,answer,category").eq("published",true).is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data??[];}
export async function listAdminFaq(){const {data,error}=await createAdminClient().from("faqs").select("*").is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data??[];}
