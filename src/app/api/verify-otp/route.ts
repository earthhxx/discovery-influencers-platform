import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

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

    // 🔹 ตรวจสอบ OTP ล่าสุด
    const result = await pool.query(
      `SELECT * FROM otp WHERE email = $1 AND ref = $2 ORDER BY id DESC LIMIT 1`,
      [email, ref]
    );

    if (result.rows.length === 0)
      return NextResponse.json({ error: "ไม่พบข้อมูล OTP นี้" }, { status: 404 });

    const otpRecord = result.rows[0];

    if (otpRecord.status === "used")
      return NextResponse.json({ error: "OTP นี้ถูกใช้ไปแล้ว กรุณาขอใหม่" }, { status: 400 });

    if (otpRecord.otp !== otp)
      return NextResponse.json({ error: "รหัส OTP ไม่ถูกต้อง" }, { status: 401 });

    // ✅ อัปเดต OTP เป็น used
    await pool.query(`UPDATE otp SET status = 'used' WHERE id = $1`, [otpRecord.id]);

    // 🔹 ดึงข้อมูล user + roles + permissions
    const userQuery = await pool.query(
      `
      SELECT 
        u.id AS user_id,
        u.email,
        json_agg(DISTINCT r.name) AS roles,
        json_agg(DISTINCT p.name) AS permissions
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.email = $1
      GROUP BY u.id
      LIMIT 1
      `,
      [email]
    );

    if (userQuery.rows.length === 0)
      return NextResponse.json({ error: "ไม่พบ role หรือ permission ของผู้ใช้นี้" }, { status: 404 });

    const { user_id, roles, permissions } = userQuery.rows[0];

    // 🔐 สร้าง session_id
    const sessionId = uuidv4();

    // ✅ เก็บ session พร้อม role + permission ใน DB
    await pool.query(
      `
      INSERT INTO sessions (session_id, user_id, roles, permissions, created_at, expires_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW() + interval '1 day')
      `,
      [sessionId, user_id, JSON.stringify(roles), JSON.stringify(permissions)]
    );

    // ✅ ตอบกลับและเซ็ต session_id cookie
    const response = NextResponse.json({
      message: "✅ ยืนยัน OTP สำเร็จ",
      email,
      roles,
      permissions,
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 วัน
    });

    return response;
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
  }
}
