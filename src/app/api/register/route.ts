import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    const pool = await getMainConnection();

    // ตรวจว่ามี email นี้ในระบบหรือยัง
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) {
      return NextResponse.json({ error: "อีเมลนี้มีอยู่แล้ว" }, { status: 400 });
    }

    // เข้ารหัสรหัสผ่านก่อนบันทึก
    const hashedPassword = await bcrypt.hash(password, 10);

    // บันทึกลงฐานข้อมูล
    await pool.query(
      "INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW())",
      [email, hashedPassword]
    );

    return NextResponse.json({ message: "✅ สมัครสมาชิกสำเร็จ", user: { email } });
  } catch (err) {
    console.error("❌ Register error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
  }
}
