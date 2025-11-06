import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import { Influencer } from "@/app/model/influencer";
import { QueryResult } from "pg";

export async function GET() {
  console.log("🚀 API /selectdata called");

  try {
    const pool = await getMainConnection();
    const result: QueryResult<Influencer> = await pool.query(
      "SELECT * FROM public.raw_people_influencers"
    );

    const influencers: Influencer[] = result.rows;
    return NextResponse.json(influencers);
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Database query error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // เผื่อกรณีที่ไม่ใช่ Error instance
    console.error("❌ Unknown error:", error);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
