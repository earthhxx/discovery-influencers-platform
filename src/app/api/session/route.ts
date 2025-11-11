// discovery-influencers-platform/src/app/api/session/route.ts
import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    if (!cookie) return NextResponse.json({ error: "ไม่พบ session" }, { status: 401 });

    const match = cookie.match(/session_id=([^;]+)/);
    if (!match) return NextResponse.json({ error: "session ไม่ถูกต้อง" }, { status: 401 });

    const sessionId = match[1];
    const pool = await getMainConnection();

    const result = await pool.query(
      `SELECT user_id, roles, permissions 
       FROM sessions 
       WHERE session_id = $1 AND expires_at > NOW() 
       LIMIT 1`,
      [sessionId]
    );

    if (result.rows.length === 0)
      return NextResponse.json({ error: "session หมดอายุ" }, { status: 401 });

    const session = result.rows[0];
    return NextResponse.json({
      user_id: session.user_id,
      roles: session.roles,
      permissions: session.permissions,
    });
  } catch (err) {
    console.error("Session fetch error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
  }
}
