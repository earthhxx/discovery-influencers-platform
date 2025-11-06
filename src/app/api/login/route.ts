import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const runtime = "nodejs"; // สำคัญมากสำหรับ nodemailer

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    }

    const pool = await getMainConnection();

    // 🔹 ตรวจสอบผู้ใช้
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้นี้ในระบบ" }, { status: 404 });
    }

    const user = result.rows[0];

    // 🔹 ตรวจรหัสผ่าน
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json({ error: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // ✅ ล็อกอินสำเร็จ → สร้าง OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const ref = crypto.randomUUID();
    const status = "pending";

    // ✅ บันทึก OTP ลงฐานข้อมูล
    await pool.query(
      `INSERT INTO otp (email, otp, ref, status, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [email, otp, ref, status]
    );

    // ✅ ส่งอีเมล OTP ด้วย Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔐 รหัส OTP สำหรับเข้าสู่ระบบ Influencer Platform",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>รหัสยืนยันเข้าสู่ระบบของคุณ</h2>
          <p>สวัสดีค่ะ,</p>
          <p>นี่คือรหัส OTP สำหรับการเข้าสู่ระบบของคุณ:</p>
          <h1 style="color:#2563eb;">${otp}</h1>
          <p>Ref: <b>${ref}</b></p>
          <p>รหัสนี้จะหมดอายุใน <b>5 นาที</b></p>
          <hr />
          <small>หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้</small>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: "✅ เข้าสู่ระบบสำเร็จ (OTP ถูกส่งไปทางอีเมลแล้ว)",
      user: { id: user.id, email: user.email },
      otp_info: { ref, status },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
  }
}
