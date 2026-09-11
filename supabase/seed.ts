import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PERMISSIONS } from "../lib/auth/permissions";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before seeding.");
const supabase = createClient(url, secret, { auth: { autoRefreshToken:false, persistSession:false } });
const root = process.cwd();

async function upsertPermission(code:string){const {data,error}=await supabase.from("permissions").upsert({code,description:code.replace(/[._]/g," ")},{onConflict:"code"}).select("id").single();if(error)throw error;return data.id;}
async function main(){
  await supabase.from("roles").upsert([
    {code:"SUPER_ADMIN",name:"Super Admin",description:"Full system administration",system:true},
    {code:"COORDINATOR",name:"Coordinator",description:"Fest content and event management",system:true},
  ],{onConflict:"code"});
  const permissionIds:Record<string,string>={};
  for(const p of PERMISSIONS)permissionIds[p]=await upsertPermission(p);
  const {data:superRole}=await supabase.from("roles").select("id").eq("code","SUPER_ADMIN").single();
  const {data:coordRole}=await supabase.from("roles").select("id").eq("code","COORDINATOR").single();
  if(!superRole||!coordRole)throw new Error("Roles were not created.");
  await supabase.from("role_permissions").delete().in("role_id",[superRole.id,coordRole.id]);
  await supabase.from("role_permissions").insert(Object.values(permissionIds).map(permission_id=>({role_id:superRole.id,permission_id})));
  const coordinatorPerms = PERMISSIONS.filter(
  p =>
    !p.startsWith("users.") &&
    !p.startsWith("roles.") &&
    !p.startsWith("sponsors.create") &&
    !p.startsWith("sponsors.edit") &&
    !p.startsWith("sponsors.delete") &&
    !p.startsWith("settings.") &&
    !p.startsWith("audit.") &&
    !p.startsWith("campus_ambassador.")
);
  await supabase.from("role_permissions").insert(coordinatorPerms.map(permission=>({role_id:coordRole.id,permission_id:permissionIds[permission]})));

  
  const email=process.env.INITIAL_ADMIN_EMAIL?.toLowerCase(); const password=process.env.INITIAL_ADMIN_PASSWORD; if(email&&password){const {data:existing}=await supabase.from("admin_users").select("id").eq("email",email).maybeSingle();let userId=existing?.id;if(!userId){const {data,error}=await supabase.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{name:"Initial Super Admin"}});if(error||!data.user)throw error??new Error("Unable to create initial admin.");userId=data.user.id;}await supabase.from("admin_users").upsert({id:userId,name:"Initial Super Admin",email,role_id:superRole.id,status:"ACTIVE",scope:"Global"},{onConflict:"id"});console.log(`Bootstrapped SUPER_ADMIN: ${email}`)}
}
main().catch(e=>{console.error(e);process.exit(1)});
