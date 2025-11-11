import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";

export async function DELETE(req: Request) {
  try {
    const { record_id } = await req.json(); // รับ id จาก body
    if (!record_id) {
      return NextResponse.json({ error: "record_id is required" }, { status: 400 });
    }

    const pool = await getMainConnection();
    await pool.query("DELETE FROM public.raw_people_influencers WHERE record_id = $1", [record_id]);

    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
