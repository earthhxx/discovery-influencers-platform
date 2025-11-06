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
            <div className="max-w-6xl mx-auto">
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
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th className="p-2 border">ชื่อ</th>
                                <th className="p-2 border">ประเทศ</th>
                                <th className="p-2 border">Platform</th>
                                <th className="p-2 border">Followers</th>
                                <th className="p-2 border">หมวดหมู่</th>
                                <th className="p-2 border">Engagement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? (
                                filtered.map((inf) => (
                                    <tr key={inf.record_id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{inf.full_name}</td>
                                        <td className="p-2 border">{inf.country || "-"}</td>
                                        <td className="p-2 border">{inf.primary_platform || "-"}</td>
                                        <td className="p-2 border text-right">
                                            {inf.followers_count?.toLocaleString() || "-"}
                                        </td>
                                        <td className="p-2 border">{inf.influencer_category || "-"}</td>
                                        <td className="p-2 border text-right">
                                            {inf.engagement_rate
                                                ? `${inf.engagement_rate.toFixed(2)}%`
                                                : "-"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
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
