import "server-only";

import { AppError } from "@/lib/errors";
import { requireAuth } from "@/lib/auth/session";
import type { PermissionCode } from "@/lib/auth/permissions";
import { createAdminClient } from "@/lib/supabase/admin";
export async function requirePermission(permission:PermissionCode){const admin=await requireAuth();if(!admin.permissions.includes(permission))throw new AppError("FORBIDDEN","You do not have permission to perform this action.");return admin;}
export function ensureCanManageTarget(actorId:string,targetId:string){if(actorId===targetId)throw new AppError("FORBIDDEN","You cannot modify your own admin account from this screen.");}
export async function countActiveSuperAdmins(excludeId?:string){const s=createAdminClient();const {data:role}=await s.from("roles").select("id").eq("code","SUPER_ADMIN").maybeSingle();if(!role)return 0;let q=s.from("admin_users").select("id",{count:"exact",head:true}).eq("role_id",role.id).eq("status","ACTIVE").is("deleted_at",null);if(excludeId)q=q.neq("id",excludeId);const {count}=await q;return count??0;}
