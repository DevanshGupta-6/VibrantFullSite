import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PERMISSIONS } from "../lib/auth/permissions";

const url = process.env.SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before seeding.");
const supabase = createClient(url, secret, { auth: { autoRefreshToken:false, persistSession:false } });
const root = process.cwd();
async function readJson(name:string){return JSON.parse(await fs.readFile(path.join(root,"data",name),"utf8"));}
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

  const events=await readJson("events.json").catch(()=>[]); for(const e of Array.isArray(events)?events:[]){await supabase.from("events").upsert({id:String(e.id),number:String(e.number??""),name:e.name,slug:e.slug??String(e.id),category:e.category??"tech",tagline:e.tagline??null,description:e.description??null,date:e.date??null,time:e.time??null,venue:e.venue??null,team_size:e.teamSize??e.team_size??null,eligibility:e.eligibility??null,rules:Array.isArray(e.rules)?e.rules:typeof e.rules==='string'?e.rules.split(/\r?\n/).filter(Boolean):[],prize:e.prize??null,fee:e.fee??null,coordinators:e.coordinators??null,contact:e.contact??null,image:e.image??null,published:e.status?e.status==='Published':e.published!==false,sort_order:Number(e.sortOrder??e.sort_order??0)},{onConflict:"id"})}
  const sponsors=await readJson("sponsors.json").catch(()=>[]); for(const s of Array.isArray(sponsors)?sponsors:[]){await supabase.from("sponsors").upsert({id:s.id&&String(s.id).match(/^[0-9a-f-]{36}$/i)?s.id:undefined,name:s.name,tier:s.tier,logo:s.logo??null,url:s.url??s.website??null,sort_order:Number(s.sortOrder??s.sort_order??0),published:s.published!==false},{onConflict:"id"})}
  const gallery=await readJson("gallery.json").catch(()=>[]); for(const g of Array.isArray(gallery)?gallery:[]){await supabase.from("gallery_photos").upsert({id:g.id&&String(g.id).match(/^[0-9a-f-]{36}$/i)?g.id:undefined,src:g.src,alt:g.alt??"VIBRANT gallery photo",category:g.category??"bts",caption:g.caption??null,aspect_ratio:g.aspectRatio??g.aspect_ratio??"square",sort_order:Number(g.displayOrder??g.sortOrder??g.sort_order??0),published:g.published!==false},{onConflict:"id"})}
  const faqs=await readJson("faq.json").catch(()=>[]); for(const f of Array.isArray(faqs)?faqs:[]){await supabase.from("faqs").upsert({id:f.id&&String(f.id).match(/^[0-9a-f-]{36}$/i)?f.id:undefined,question:f.question,answer:f.answer??null,category:f.category??"general",sort_order:Number(f.order??f.sortOrder??f.sort_order??0),published:f.published!==false},{onConflict:"id"})}
  const schedule=await readJson("schedule.json").catch(()=>[]); for(const [i,s] of (Array.isArray(schedule)?schedule:[]).entries()){await supabase.from("schedule_items").upsert({id:s.id&&String(s.id).match(/^[0-9a-f-]{36}$/i)?s.id:crypto.randomUUID(),day:String(s.day??"Day 1"),date_text:String(s.dateText??s.dateLabel??""),time:String(s.time??""),title:String(s.title??""),description:s.description??s.note??null,sort_order:Number(s.sortOrder??i),published:s.published!==false},{onConflict:"id"})}
  const settings=await readJson("settings.json").catch(()=>null); if(settings){const x=Array.isArray(settings)?settings[0]:settings;await supabase.from("site_settings").upsert({id:"site",event_name:x.eventName??"VIBRANT 2K26",tagline:x.tagline??"INNOVATE. IMPACT. IDEAS.",dates_label:x.datesLabel??"16 & 17 October 2026",venue:x.venue??"G.L. Bajaj Institute of Technology & Management",registration_url:x.registrationUrl??null,instagram_url:x.instagramUrl??null,linkedin_url:x.linkedinUrl??null})}
  const email=process.env.INITIAL_ADMIN_EMAIL?.toLowerCase(); const password=process.env.INITIAL_ADMIN_PASSWORD; if(email&&password){const {data:existing}=await supabase.from("admin_users").select("id").eq("email",email).maybeSingle();let userId=existing?.id;if(!userId){const {data,error}=await supabase.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{name:"Initial Super Admin"}});if(error||!data.user)throw error??new Error("Unable to create initial admin.");userId=data.user.id;}await supabase.from("admin_users").upsert({id:userId,name:"Initial Super Admin",email,role_id:superRole.id,status:"ACTIVE",scope:"Global"},{onConflict:"id"});console.log(`Bootstrapped SUPER_ADMIN: ${email}`)}
}
main().catch(e=>{console.error(e);process.exit(1)});
