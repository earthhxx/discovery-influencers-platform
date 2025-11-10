import { getMainConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

async function seedUsers() {
  const emails = [
    "somchai.prasert@example.com",
    "sudarat.w@example.com",
    "anan.chavalit@example.com",
    "nattapong.srisuk@example.com",
    "kamonchanok.s@example.com",
    "peerawat.k@example.com",
    "siriporn.c@example.com",
    "thaksin.b@example.com",
    "worarat.t@example.com",
    "chakrit.m@example.com",
    "warunyu.p@example.com",
    "kittiya.s@example.com",
    "anongnat.s@example.com",
    "tawan.r@example.com",
    "malai.p@example.com",
    "phuwadol.n@example.com",
    "kanyarat.d@example.com",
    "surasak.p@example.com",
    "chuenjit.m@example.com",
    "ritthirong.k@example.com",
    "napasorn.kittiya@example.com",
    "pattarapon.y@example.com",
    "supakrit.l@example.com",
    "lalita.c@example.com",
    "prangthip.s@example.com",
    "arthit.d@example.com",
    "chanapa.w@example.com",
    "veeravit.s@example.com",
    "jirapa.m@example.com",
    "bordin.a@example.com"
  ];

  const pool = await getMainConnection();

  for (const email of emails) {
    // ตรวจซ้ำก่อน
    const checkUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length > 0) continue;

    const hashedPassword = await bcrypt.hash("1234", 10);

    await pool.query(
      "INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW())",
      [email, hashedPassword]
    );

    console.log(`✅ เพิ่มผู้ใช้: ${email}`);
  }

  console.log("🎉 Seed users เสร็จเรียบร้อย");
}

seedUsers().catch(console.error);
