"use server";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { requirePermission, ensureCanManageTarget, countActiveSuperAdmins } from '@/lib/auth/authorize';
import { auditAction } from '@/lib/audit';
import { createAdminSchema, updateAdminSchema } from '@/lib/validation/admin';
import { enforceRateLimit } from '@/lib/rateLimit';

export async function getUsers(){
  await requirePermission('users.view');
  const {data,error}=await createAdminClient().from('admin_users').select('id,name,email,status,scope,last_login_at,created_at,role:role_id(id,name,code)').is('deleted_at',null).order('created_at',{ascending:false});
  if(error)throw new Error(error.message);
  return (data??[]).map((r:any)=>({id:r.id,name:r.name,email:r.email,status:r.status,scope:r.scope,lastLoginAt:r.last_login_at,createdAt:r.created_at,role:Array.isArray(r.role)?r.role[0]:r.role}));
}

async function resolveRole(input:string){const s=createAdminClient();for(const key of ['id','code','name'] as const){const {data,error}=await s.from('roles').select('id,name,code').eq(key,input).maybeSingle();if(error)throw new Error(error.message);if(data)return data;}throw new Error('Selected role not found.');}

export async function addUser(fd:FormData){
  const actor=await requirePermission('users.create'); await enforceRateLimit(`mutation:${actor.id}:user:create`,30,3600);
  const input=createAdminSchema.parse({name:fd.get('name'),email:fd.get('email'),password:fd.get('password'),roleId:fd.get('roleId')||fd.get('role'),scope:fd.get('scope')||'Global',status:fd.get('status')||'ACTIVE'});
  const role=await resolveRole(input.roleId);
  if(input.status==='PENDING')throw new Error('Use public registration for pending accounts.');
  if(role.code==='SUPER_ADMIN'&&actor.role.code!=='SUPER_ADMIN')throw new Error('Only an existing SUPER_ADMIN can assign SUPER_ADMIN.');
  const s=createAdminClient();
  const {data:user,error:userError}=await s.auth.admin.createUser({email:input.email.toLowerCase(),password:input.password,email_confirm:true,user_metadata:{name:input.name}});
  if(userError||!user.user)throw new Error(userError?.message||'Unable to create authentication account.');
  const {data:row,error}=await s.from('admin_users').insert({id:user.user.id,name:input.name,email:input.email.toLowerCase(),role_id:role.id,status:'ACTIVE',scope:input.scope}).select('id').single();
  if(error){await s.auth.admin.deleteUser(user.user.id);throw new Error(error.message)}
  await auditAction({actorId:actor.id,action:'ADMIN_CREATED',entityType:'Admin',entityId:row.id,metadata:{email:input.email.toLowerCase(),role:role.code}});
  revalidatePath('/admin/users');redirect('/admin/users?success=true');
}

export async function updateUser(id:string,fd:FormData){
  const actor=await requirePermission('users.edit'); ensureCanManageTarget(actor.id,id);
  const input=updateAdminSchema.parse({name:fd.get('name'),email:fd.get('email'),password:fd.get('password')||'',roleId:fd.get('roleId')||fd.get('role'),scope:fd.get('scope')||'Global',status:fd.get('status')||'ACTIVE'});
  const s=createAdminClient(); const {data:existing}=await s.from('admin_users').select('id,name,email,status,role_id,role:role_id(id,name,code)').eq('id',id).is('deleted_at',null).maybeSingle(); if(!existing)throw new Error('Admin not found.');
  const oldRole=Array.isArray(existing.role)?existing.role[0]:existing.role; const role=await resolveRole(input.roleId);
  if((role.code==='SUPER_ADMIN'||oldRole?.code==='SUPER_ADMIN')&&actor.role.code!=='SUPER_ADMIN')throw new Error('Only an existing SUPER_ADMIN can change SUPER_ADMIN accounts.');
  if(input.status==='DISABLED'&&oldRole?.code==='SUPER_ADMIN'&&(await countActiveSuperAdmins(id))<1)throw new Error('Cannot disable the last active SUPER_ADMIN.');
  const {error}=await s.from('admin_users').update({name:input.name,email:input.email.toLowerCase(),role_id:role.id,scope:input.scope,status:input.status}).eq('id',id); if(error)throw new Error(error.message);
  if(input.password){const {error:e}=await s.auth.admin.updateUserById(id,{password:input.password,email:input.email.toLowerCase(),user_metadata:{name:input.name}});if(e)throw new Error(e.message)} else if(existing.email!==input.email.toLowerCase()){const {error:e}=await s.auth.admin.updateUserById(id,{email:input.email.toLowerCase(),user_metadata:{name:input.name}});if(e)throw new Error(e.message)} else {await s.auth.admin.updateUserById(id,{user_metadata:{name:input.name}})}
  await auditAction({actorId:actor.id,action:'ADMIN_UPDATED',entityType:'Admin',entityId:id,metadata:{role:role.code}});
  if(oldRole?.id!==role.id)await auditAction({actorId:actor.id,action:'ADMIN_ROLE_CHANGED',entityType:'Admin',entityId:id,metadata:{fromRole:oldRole?.code,toRole:role.code}});
  if(existing.status!==input.status)await auditAction({actorId:actor.id,action:input.status==='ACTIVE'?'ADMIN_ENABLED':'ADMIN_DISABLED',entityType:'Admin',entityId:id});
  revalidatePath('/admin/users');redirect('/admin/users?success=true');
}

export async function deleteUser(id:string){const a=await requirePermission('users.delete');ensureCanManageTarget(a.id,id);const s=createAdminClient();const {data:existing}=await s.from('admin_users').select('email,status,role:role_id(code)').eq('id',id).is('deleted_at',null).maybeSingle();if(!existing)return;const role=Array.isArray(existing.role)?existing.role[0]:existing.role;if(role?.code==='SUPER_ADMIN'&&(await countActiveSuperAdmins(id))<1)throw new Error('Cannot remove the last active SUPER_ADMIN.');const {error}=await s.from('admin_users').update({status:'DISABLED',deleted_at:new Date().toISOString()}).eq('id',id);if(error)throw new Error(error.message);await s.auth.admin.deleteUser(id);await auditAction({actorId:a.id,action:'ADMIN_DISABLED',entityType:'Admin',entityId:id,metadata:{email:existing.email}});revalidatePath('/admin/users')}
export async function setUserStatus(id:string,status:'ACTIVE'|'DISABLED'){const a=await requirePermission('users.edit');ensureCanManageTarget(a.id,id);const s=createAdminClient();const {data:existing}=await s.from('admin_users').select('status,role:role_id(code)').eq('id',id).is('deleted_at',null).maybeSingle();if(!existing)throw new Error('Admin not found.');const role=Array.isArray(existing.role)?existing.role[0]:existing.role;if(status==='DISABLED'&&role?.code==='SUPER_ADMIN'&&(await countActiveSuperAdmins(id))<1)throw new Error('Cannot disable the last active SUPER_ADMIN.');const {error}=await s.from('admin_users').update({status}).eq('id',id);if(error)throw new Error(error.message);await auditAction({actorId:a.id,action:status==='ACTIVE'?'ADMIN_ENABLED':'ADMIN_DISABLED',entityType:'Admin',entityId:id});revalidatePath('/admin/users')}
