import "server-only";
import { createClient } from "@/lib/supabase/server";
export async function listPublicFaq(){const {data,error}=await (await createClient()).from("faqs").select("id,question,answer,category").eq("published",true).is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data??[];}
export async function listAdminFaq(){const supabase=await createClient();
  const {data,error}=await supabase.from("faqs").select("*").is("deleted_at",null).order("sort_order").order("created_at");if(error)throw new Error(error.message);return data??[];}
