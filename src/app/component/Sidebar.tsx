"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Shield, Settings, LogOut, Menu } from "lucide-react";
import { UserSession } from "../model/users";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [session, setSession] = useState<UserSession | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/session");
                if (res.ok) {
                    const data = await res.json();
                    setSession(data);
                }
            } catch (err) {
                console.error("Session fetch error:", err);
            }
        };
        fetchSession();
    }, []);

    const hasPermission = (perm: string) =>
        session?.permissions?.includes(perm);

    const hasRole = (perm: string) =>
        session?.roles?.includes(perm);

    // หน้า React / Client Component
    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    }

    return (
        <aside
            className={`fixed h-screen bg-gray-900 text-gray-100 flex flex-col transition-all duration-300 z-50
        ${collapsed ? "w-16" : "w-64"}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-800">
                {!collapsed && (
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="text-gray-300 hover:text-white transition"
                >
                    <Menu size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 mt-3 space-y-1">
                <SidebarItem
                    icon={<Home size={18} />}
                    label="หน้าหลัก"
                    href="/"
                    active={pathname === "/"}
                    collapsed={collapsed}
                />
                {hasRole("influencer") && (
                    <SidebarItem
                        icon={<Users size={18} />}
                        label="ตั้งค่าผู้ใช้"
                        href="/user/edit"
                        active={pathname.startsWith("/user")}
                        collapsed={collapsed}
                    />
                )}
                {hasPermission("search") && (
                    <SidebarItem
                        icon={<Shield size={18} />}
                        label="ค้นหา influencer"
                        href="/search"
                        active={pathname.startsWith("/search")}
                        collapsed={collapsed}
                    />
                )}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 text-sm hover:text-red-400 transition w-full ${collapsed ? "justify-center" : ""
                        }`}
                >
                    <LogOut size={18} />
                    {!collapsed && <span>ออกจากระบบ</span>}
                </button>
            </div>
        </aside>
    );
}

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    href: string;
    active: boolean;
    collapsed: boolean;
}

function SidebarItem({
    icon,
    label,
    href,
    active,
    collapsed,
}: SidebarItemProps) {
    return (
        <Link
            href={href}
            className={` flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors 
      ${active ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"}
      ${collapsed ? "justify-center" : ""}`}
        >
            {icon}
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}
