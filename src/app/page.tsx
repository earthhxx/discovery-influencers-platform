import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMainConnection } from "@/lib/db";

export default async function HomePage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const pool = await getMainConnection();

  // ✅ Query join กับ users
  const result = await pool.query(
    `
    SELECT u.email 
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_id = $1
      AND s.expires_at > NOW()
    LIMIT 1
    `,
    [sessionId]
  );

  const user = result.rows[0];
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
        <p className="mt-2 text-gray-600">
          Logged in as <span className="font-medium">{user.email}</span>
        </p>
      </div>
    </main>
  );
}
