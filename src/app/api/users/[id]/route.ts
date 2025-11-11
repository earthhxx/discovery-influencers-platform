// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { getMainConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

interface Props {
  params: { id: string | Promise<string> };
}

export async function GET(req: Request, { params }: Props) {
  try {
    // ✅ unwrap params.id ก่อน
    const resolvedParams = await params;  // await ทั้ง object
    const idStr = await resolvedParams.id; // await id
    const id = parseInt(idStr, 10); 

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    const pool = await getMainConnection();
    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [id]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("GET user error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: Props) {
  try {
    const resolvedParams = await params;
    const idStr = await resolvedParams.id;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: "กรุณากรอก password" }, { status: 400 });
    }

    // 🔐 แฮชรหัสผ่านก่อนอัปเดต
    const hashedPassword = await bcrypt.hash(password, 10);

    const pool = await getMainConnection();
    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashedPassword, id]
    );

    return NextResponse.json({ message: "อัปเดตรหัสผ่านสำเร็จ" });
  } catch (err) {
    console.error("PATCH user error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}