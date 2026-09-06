import { AppError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
export type AdminContext={id:string;name:string;email:string;status:"PENDING"|"ACTIVE"|"DISABLED";scope:string|null;role:{id:string;name:string;code:string};permissions:string[]};
export async function requireAuth():Promise<AdminContext>{
  const supabase=await createClient();
  const {data:{user},error}=await supabase.auth.getUser();
  if(error||!user) throw new AppError("UNAUTHORIZED","You must be signed in.");
  const {data:admin,error:adminError}=await supabase.from("admin_users").select("id,name,email,status,scope,role_id,roles:role_id(id,name,code)").eq("id",user.id).is("deleted_at",null).maybeSingle();
  if(adminError||!admin) throw new AppError("UNAUTHORIZED","You do not have admin access.");
  if(admin.status!=="ACTIVE") throw new AppError("UNAUTHORIZED","Your admin account is not active.");
  const role=Array.isArray(admin.roles)?admin.roles[0]:admin.roles;
  if(!role) throw new AppError("FORBIDDEN","Your account has no valid role.");
  const {data:rp,error:rpError}=await supabase.from("role_permissions").select("permissions:permission_id(code)").eq("role_id",admin.role_id);
  if(rpError) throw new AppError("INTERNAL_SERVER_ERROR","Unable to load permissions.");
  return {id:admin.id,name:admin.name,email:admin.email,status:admin.status,scope:admin.scope,role:{id:role.id,name:role.name,code:role.code},permissions:(rp??[]).map(r=>{const p=Array.isArray(r.permissions)?r.permissions[0]:r.permissions;return p?.code}).filter((x):x is string=>Boolean(x))};
}
