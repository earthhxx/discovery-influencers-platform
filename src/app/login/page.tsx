"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [mode, setMode] = useState<"login" | "register">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    function goToSearch() {
        router.push("/search"); // ✅ ไปหน้า /search
    }

    // 🔹 state สำหรับ OTP popup
    const [showOTP, setShowOTP] = useState(false);
    const [otp, setOtp] = useState("");
    const [ref, setRef] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");

        if (mode === "register" && password !== confirmPassword) {
            return setMessage("❌ รหัสผ่านไม่ตรงกัน");
        }

        setLoading(true);

        try {
            const res = await fetch(`/api/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            //earthhwachirawit@gmail.com

            if (res.ok) {
                if (mode === "login") {
                    // 🔹 ถ้า login สำเร็จ → แสดง popup OTP
                    console.log("Login successful:", data);
                    // ✅ เช็ก otp_info.ref จาก API
                    if (data.otp_info?.ref) {
                        setRef(data.otp_info.ref);
                        setShowOTP(true);
                        setMessage("📩 รหัส OTP ถูกส่งไปที่อีเมลของคุณแล้ว");
                    } else {
                        setMessage("เข้าสู่ระบบสำเร็จโดยไม่ต้องยืนยัน OTP");
                    }
                } else {
                    setMessage("✅ สมัครสมาชิกสำเร็จ");
                }

                setPassword("");
                setConfirmPassword("");
            } else {
                setMessage(data.error || "❌ เกิดข้อผิดพลาด");
            }
        } catch (error) {
            console.error(error);
            setMessage("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }

        setLoading(false);
    }

    // 🔹 ฟังก์ชันยืนยัน OTP
    async function handleVerifyOTP(e: React.FormEvent) {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const res = await fetch(`/api/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ref, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("🎉 ยืนยัน OTP สำเร็จ! เข้าสู่ระบบเรียบร้อยแล้ว");
                setShowOTP(false);
                goToSearch();
            } else {
                setMessage(data.error || "❌ OTP ไม่ถูกต้อง");
            }
        } catch (err) {
            setMessage("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
        }

        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="อีเมล"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-3"
                        required
                    />

                    <input
                        type="password"
                        placeholder="รหัสผ่าน"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg p-3 mb-3"
                        required
                    />

                    {mode === "register" && (
                        <input
                            type="password"
                            placeholder="ยืนยันรหัสผ่าน"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-3"
                            required
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white ${mode === "login"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-green-600 hover:bg-green-700"
                            } disabled:opacity-50`}
                    >
                        {loading ? "กำลังดำเนินการ..." : mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
                    </button>
                </form>

                {message && (
                    <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
                )}

                <div className="text-center mt-6 text-sm text-gray-600">
                    {mode === "login" ? (
                        <>
                            ยังไม่มีบัญชี?{" "}
                            <button
                                onClick={() => setMode("register")}
                                className="text-blue-600 hover:underline"
                            >
                                สมัครสมาชิก
                            </button>
                        </>
                    ) : (
                        <>
                            มีบัญชีอยู่แล้ว?{" "}
                            <button
                                onClick={() => setMode("login")}
                                className="text-blue-600 hover:underline"
                            >
                                เข้าสู่ระบบ
                            </button>
                        </>
                    )}
                </div>

                {/* 🔹 Popup OTP */}
                {showOTP && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                        <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                            <h3 className="text-lg font-semibold mb-4 text-center">
                                🔐 ยืนยันรหัส OTP
                            </h3>
                            <form onSubmit={handleVerifyOTP}>
                                <input
                                    type="text"
                                    placeholder="กรอกรหัส OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border rounded-lg p-3 mb-3 text-center"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 disabled:opacity-50"
                                >
                                    {loading ? "กำลังตรวจสอบ..." : "ยืนยัน OTP"}
                                </button>
                            </form>
                            <button
                                onClick={() => setShowOTP(false)}
                                className="block w-full text-center text-sm text-gray-600 mt-3 hover:underline"
                            >
                                ปิด
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
