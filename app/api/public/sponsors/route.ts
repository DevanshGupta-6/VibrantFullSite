import { NextResponse } from "next/server";
import { listPublicSponsors } from "@/lib/services/sponsors";

export const revalidate = 0;

export async function GET() {
  try {
    const data = await listPublicSponsors();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load public data." },
      { status: 500 }
    );
  }
}