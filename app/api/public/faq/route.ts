import { NextResponse } from "next/server";
import { listPublicFaq } from "@/lib/services/faq";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await listPublicFaq();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to load public data." }, { status: 500 });
  }
}
