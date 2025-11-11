"use client";

import { useState, FormEvent } from "react";
import { Influencer } from "@/app/model/influencer";

interface InfluencerFormProps {
    influencer: Influencer;
    onSubmit: (updated: Influencer) => void;
    onCancel?: () => void;
    saving?: boolean;
}

export default function InfluencerForm({ influencer, onSubmit, onCancel, saving = false }: InfluencerFormProps) {
    if (!influencer) return null;

    const [formData, setFormData] = useState<Influencer>(influencer);

    const handleChange = (field: keyof Influencer, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
            {/* Personal Info */}
            <div>
                <label className="block mb-1 font-medium">ชื่อเต็ม</label>
                <input
                    type="text"
                    value={formData.full_name ?? ""}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    className="border p-2 rounded w-full"
                    required
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ชื่อเรียก</label>
                <input
                    type="text"
                    value={formData.preferred_name ?? ""}
                    onChange={(e) => handleChange("preferred_name", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">เพศ</label>
                <input
                    type="text"
                    value={formData.gender ?? ""}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">วันเกิด</label>
                <input
                    type="date"
                    value={formData.birth_date ?? ""}
                    onChange={(e) => handleChange("birth_date", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">อีเมล</label>
                <input
                    type="email"
                    value={formData.email ?? ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">โทรศัพท์</label>
                <input
                    type="text"
                    value={formData.phone ?? ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">เมือง</label>
                <input
                    type="text"
                    value={formData.city ?? ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ประเทศ</label>
                <input
                    type="text"
                    value={formData.country ?? ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">อาชีพ</label>
                <input
                    type="text"
                    value={formData.occupation ?? ""}
                    onChange={(e) => handleChange("occupation", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">หมวดหมู่</label>
                <input
                    type="text"
                    value={formData.influencer_category ?? ""}
                    onChange={(e) => handleChange("influencer_category", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">แพลตฟอร์มหลัก</label>
                <input
                    type="text"
                    value={formData.primary_platform ?? ""}
                    onChange={(e) => handleChange("primary_platform", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ผู้ติดตามหลัก</label>
                <input
                    type="number"
                    value={formData.followers_count ?? 0}
                    onChange={(e) => handleChange("followers_count", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ยอดรวมผู้ติดตาม</label>
                <input
                    type="number"
                    value={formData.total_followers_count ?? 0}
                    onChange={(e) => handleChange("total_followers_count", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Engagement Rate (%)</label>
                <input
                    type="number"
                    step="0.01"
                    value={formData.engagement_rate ?? 0}
                    onChange={(e) => handleChange("engagement_rate", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Tier</label>
                <input
                    type="text"
                    value={formData.engagement_rate_tier ?? ""}
                    onChange={(e) => handleChange("engagement_rate_tier", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ความสนใจ</label>
                <input
                    type="text"
                    value={formData.interests ?? ""}
                    onChange={(e) => handleChange("interests", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">บันทึก</label>
                <textarea
                    value={formData.notes ?? ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="border p-2 rounded w-full"
                    rows={3}
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">แพลตฟอร์มรอง</label>
                <input
                    type="text"
                    value={formData.secondary_platform ?? ""}
                    onChange={(e) => handleChange("secondary_platform", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ผู้ติดตามแพลตฟอร์มรอง</label>
                <input
                    type="number"
                    value={formData.secondary_followers_count ?? 0}
                    onChange={(e) => handleChange("secondary_followers_count", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Reach เฉลี่ยต่อเดือน</label>
                <input
                    type="number"
                    value={formData.average_monthly_reach ?? 0}
                    onChange={(e) => handleChange("average_monthly_reach", Number(e.target.value))}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">สถานะความร่วมมือ</label>
                <input
                    type="text"
                    value={formData.collaboration_status ?? ""}
                    onChange={(e) => handleChange("collaboration_status", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">ภาษา</label>
                <input
                    type="text"
                    value={formData.languages ?? ""}
                    onChange={(e) => handleChange("languages", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">Portfolio URL</label>
                <input
                    type="url"
                    value={formData.portfolio_url ?? ""}
                    onChange={(e) => handleChange("portfolio_url", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium">วันที่ติดต่อครั้งสุดท้าย</label>
                <input
                    type="date"
                    value={formData.last_contact_date ?? ""}
                    onChange={(e) => handleChange("last_contact_date", e.target.value)}
                    className="border p-2 rounded w-full"
                />
            </div>

            {/* Submit Buttons */}
            <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                        ยกเลิก
                    </button>
                )}
                <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                    {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
            </div>
        </form>
    );
}
