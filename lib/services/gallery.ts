import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage } from "@/lib/types";
export async function listPublicGallery():Promise<GalleryImage[]>{const {data,error}=await (await createClient()).from("gallery_photos").select("id,src,alt,category,caption,aspect_ratio").eq("published",true).is("deleted_at",null).order("sort_order").order("created_at",{ascending:false});if(error)throw new Error(error.message);return (data??[]).map((x:any)=>({...x,aspectRatio:x.aspect_ratio})) as GalleryImage[];}
export async function listAdminGallery(){const supabase=await createClient();
  const {data,error}=await supabase.from("gallery_photos").select("*").is("deleted_at",null).order("sort_order").order("created_at",{ascending:false});if(error)throw new Error(error.message);return data??[];}
