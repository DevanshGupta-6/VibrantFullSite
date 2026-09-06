import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
export async function POST(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(user){await (async()=>{try{const {auditAction}=await import('@/lib/audit');await auditAction({actorId:user.id,action:'ADMIN_LOGOUT',entityType:'Admin',entityId:user.id})}catch{}})();}await supabase.auth.signOut();return NextResponse.json({ok:true});}
