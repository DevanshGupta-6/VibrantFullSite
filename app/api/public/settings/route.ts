import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/services/settings";
export const revalidate = 60;
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}
