import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
export async function POST(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(user){await createAdminClient().from('admin_users').select('id').eq('id',user.id).maybeSingle();await (async()=>{try{const {auditAction}=await import('@/lib/audit');await auditAction({actorId:user.id,action:'ADMIN_LOGOUT',entityType:'Admin',entityId:user.id})}catch{}})();}await supabase.auth.signOut();return NextResponse.json({ok:true});}
