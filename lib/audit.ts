import "server-only";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
export async function auditAction(input:{actorId?:string|null;action:string;entityType?:string;entityId?:string;metadata?:Record<string,unknown>}){const h=await headers();const ipAddress=h.get("x-forwarded-for")?.split(",")[0]?.trim()||h.get("x-real-ip")||null;const userAgent=h.get("user-agent")?.slice(0,1000)||null;const {error}=await createAdminClient().from("audit_logs").insert({actor_id:input.actorId??null,action:input.action,entity_type:input.entityType??null,entity_id:input.entityId??null,ip_address:ipAddress,user_agent:userAgent,metadata:input.metadata??null});if(error)throw new Error(`Audit log failed: ${error.message}`);}
