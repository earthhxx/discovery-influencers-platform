"use client";

import { useEffect, useState } from "react";
import { Influencer } from "../model/influencer";

export default function SearchPage() {
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [filtered, setFiltered] = useState<Influencer[]>([]);
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState("");
    const [platform, setPlatform] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const res = await fetch("/api/selectdata");
                const data = await res.json();
                console.log("Fetched influencers:", data);
                setInfluencers(data);
                setFiltered(data);
            } catch (err) {
                console.error("Failed to fetch:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInfluencers();
    }, []);

    // ฟิลเตอร์เมื่อค่า search หรือ filter เปลี่ยน
    useEffect(() => {
        const filteredData = influencers.filter((inf) => {
            const matchName =
                inf.full_name?.toLowerCase().includes(search.toLowerCase()) ?? false;

            const matchCountry =
                !country ||
                inf.country?.toLowerCase().includes(country.toLowerCase());

            const matchPlatform =
                !platform ||
                inf.primary_platform?.toLowerCase().includes(platform.toLowerCase());

            const matchCategory =
                !category ||
                inf.influencer_category?.toLowerCase().includes(category.toLowerCase());

            return matchName && matchCountry && matchPlatform && matchCategory;
        });

        setFiltered(filteredData);
    }, [search, country, platform, category, influencers]);


    if (loading)
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                กำลังโหลดข้อมูล...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 p-6 text-black">
            <div className="mx-[5%]">
                <h1 className="text-2xl font-semibold mb-6 text-center">
                    🔍 ค้นหา Influencers
                </h1>

                {/* ฟอร์มกรอง */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="ประเทศ"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="Platform (เช่น Instagram)"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                    <input
                        type="text"
                        placeholder="หมวดหมู่ (เช่น Fashion)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded-lg w-full"
                    />
                </div>

                {/* ตารางผลลัพธ์ */}
                <div className="overflow-x-auto bg-white shadow-md rounded-lg h-[80vh]">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-200 text-gray-700 sticky top-0">
                            <tr>
                                <th className="p-2 border">Record ID</th>
                                <th className="p-2 border">Record Type</th>
                                <th className="p-2 border">ชื่อเต็ม</th>
                                <th className="p-2 border">ชื่อเรียก</th>
                                <th className="p-2 border">เพศ</th>
                                <th className="p-2 border">วันเกิด</th>
                                <th className="p-2 border">อีเมล</th>
                                <th className="p-2 border">โทรศัพท์</th>
                                <th className="p-2 border">เมือง</th>
                                <th className="p-2 border">ประเทศ</th>
                                <th className="p-2 border">อาชีพ</th>
                                <th className="p-2 border">หมวดหมู่</th>
                                <th className="p-2 border">แพลตฟอร์มหลัก</th>
                                <th className="p-2 border">ผู้ติดตามหลัก</th>
                                <th className="p-2 border">ยอดรวมผู้ติดตาม</th>
                                <th className="p-2 border">Engagement Rate</th>
                                <th className="p-2 border">Tier</th>
                                <th className="p-2 border">ความสนใจ</th>
                                <th className="p-2 border">บันทึก</th>
                                <th className="p-2 border">แพลตฟอร์มรอง</th>
                                <th className="p-2 border">ผู้ติดตามแพลตฟอร์มรอง</th>
                                <th className="p-2 border">Reach เฉลี่ยต่อเดือน</th>
                                <th className="p-2 border">สถานะความร่วมมือ</th>
                                <th className="p-2 border">ภาษา</th>
                                <th className="p-2 border">Portfolio</th>
                                <th className="p-2 border">วันที่ติดต่อครั้งสุดท้าย</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((inf) => (
                                    <tr key={inf.record_id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{inf.record_id}</td>
                                        <td className="p-2 border">{inf.record_type || "-"}</td>
                                        <td className="p-2 border">{inf.full_name}</td>
                                        <td className="p-2 border">{inf.preferred_name || "-"}</td>
                                        <td className="p-2 border text-center">{inf.gender || "-"}</td>
                                        <td className="p-2 border">{inf.birth_date || "-"}</td>
                                        <td className="p-2 border">{inf.email || "-"}</td>
                                        <td className="p-2 border">{inf.phone || "-"}</td>
                                        <td className="p-2 border">{inf.city || "-"}</td>
                                        <td className="p-2 border">{inf.country || "-"}</td>
                                        <td className="p-2 border">{inf.occupation || "-"}</td>
                                        <td className="p-2 border">{inf.influencer_category || "-"}</td>
                                        <td className="p-2 border">{inf.primary_platform || "-"}</td>
                                        <td className="p-2 border text-right">
                                            {inf.followers_count?.toLocaleString() || "-"}
                                        </td>
                                        <td className="p-2 border text-right">
                                            {inf.total_followers_count?.toLocaleString() || "-"}
                                        </td>
                                        <td className="p-2 border text-right">
                                            {inf.engagement_rate ? `${inf.engagement_rate.toFixed(2)}%` : "-"}
                                        </td>
                                        <td className="p-2 border">{inf.engagement_rate_tier || "-"}</td>
                                        <td className="p-2 border">{inf.interests || "-"}</td>
                                        <td className="p-2 border">{inf.notes || "-"}</td>
                                        <td className="p-2 border">{inf.secondary_platform || "-"}</td>
                                        <td className="p-2 border text-right">
                                            {inf.secondary_followers_count?.toLocaleString() || "-"}
                                        </td>
                                        <td className="p-2 border text-right">
                                            {inf.average_monthly_reach?.toLocaleString() || "-"}
                                        </td>
                                        <td className="p-2 border">{inf.collaboration_status || "-"}</td>
                                        <td className="p-2 border">{inf.languages || "-"}</td>
                                        <td className="p-2 border">
                                            {inf.portfolio_url ? (
                                                <a
                                                    href={inf.portfolio_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-500 underline"
                                                >
                                                    เปิดลิงก์
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="p-2 border">{inf.last_contact_date || "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={26} className="p-4 text-center text-gray-500">
                                        ไม่พบข้อมูลที่ตรงกับเงื่อนไข
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
