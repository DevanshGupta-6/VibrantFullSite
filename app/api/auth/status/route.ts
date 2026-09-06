import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
export async function GET(){try{const a=await requireAuth();return NextResponse.json({ok:true,user:{id:a.id,role:a.role.code}})}catch{return NextResponse.json({ok:false},{status:401})}}
