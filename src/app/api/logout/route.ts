import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // อ่าน cookie session_id
    const cookieHeader = req.headers.get("cookie") || "";
    const cookiesArr = cookieHeader.split(";").map(c => c.trim());
    const sessionCookie = cookiesArr.find(c => c.startsWith("session_id="));
    const sessionId = sessionCookie?.split("=")[1];

    if (sessionId) {
      const pool = await getMainConnection();
      // ลบ session ออกจาก DB
      await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
    }

    // ลบ cookie
    const response = NextResponse.json({ message: "Logout สำเร็จ" });
    response.cookies.set("session_id", "", {
      path: "/",
      maxAge: 0, // ลบ cookie
      httpOnly: true,
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error("❌ Logout error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
