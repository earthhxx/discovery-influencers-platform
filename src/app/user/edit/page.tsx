"use client";

import { useEffect, useState } from "react";

type SessionData = {
  user_id: number;
  roles: string[];
  permissions: string[];
};

type UserData = {
  id: number;
  email: string;
  created_at: string;
};

export default function EditUserPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session) return;

    const fetchData = async () => {
      try {
        // ดึง session
        const resSession = await fetch("/api/session");
        const sessionData = await resSession.json();
        if (sessionData.error) {
          alert(sessionData.error);
          setLoading(false);
          return;
        }
        setSession(sessionData);

        // ดึงข้อมูล user
        const userId = sessionData.user_id;
        const resUser = await fetch(`/api/users/${userId}`);
        const userData = await resUser.json();
        setUser(userData);
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  const handleSave = async () => {
    if (!user) return;
    if (!password) {
      alert("กรุณากรอก password ใหม่");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    alert(data.message || data.error);
    setSaving(false);
  };

  if (loading) return <div className="fixed text-center">Loading...</div>;
  if (!user) return <div className="fixed text-center">ไม่พบผู้ใช้</div>;

  return (
    <div className="min-h-screen mx-auto p-[10%] bg-white rounded shadow text-black">
      <h1 className="text-xl font-bold mb-4">Edit User Info</h1>

      <div className="mb-4">
        <label className="block mb-1">Email (ไม่สามารถแก้ไข)</label>
        <input
          className="w-full border p-2 rounded"
          value={user.email}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input
          type="password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="กรอก password ใหม่"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {saving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
