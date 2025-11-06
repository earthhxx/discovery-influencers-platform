import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp, ref } = await req.json();

    if (!email || !otp || !ref) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const pool = await getMainConnection();

    // ดึง otp record ล่าสุดของ email นี้และ ref นี้
    const result = await pool.query(
      `SELECT * FROM otp WHERE email = $1 AND ref = $2 ORDER BY id DESC LIMIT 1`,
      [email, ref]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูล OTP นี้" },
        { status: 404 }
      );
    }

    const otpRecord = result.rows[0];

    // ถ้าใช้ไปแล้ว
    if (otpRecord.status === "used") {
      return NextResponse.json(
        { error: "OTP นี้ถูกใช้ไปแล้ว กรุณาขอใหม่" },
        { status: 400 }
      );
    }

    // ตรวจ OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { error: "รหัส OTP ไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // ✅ อัปเดตสถานะเป็น used
    await pool.query(
      `UPDATE otp SET status = 'used' WHERE id = $1`,
      [otpRecord.id]
    );

    return NextResponse.json({
      message: "✅ ยืนยัน OTP สำเร็จ",
      email,
    });
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}
