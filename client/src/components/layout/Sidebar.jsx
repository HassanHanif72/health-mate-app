"use client";

import { Home, Upload, FileText, Activity, Clock, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLogoutMutation } from "@/redux/services/authApi";

const menuItems = [
    { icon: <Home size={18} />, label: "Dashboard", href: "/dashboard" },
    { icon: <User size={18} />, label: "Profile", href: "/dashboard/profile" },
    { icon: <Upload size={18} />, label: "Upload Report", href: "/dashboard/upload-report" },
    { icon: <FileText size={18} />, label: "Reports", href: "/dashboard/reports" },
    { icon: <Activity size={18} />, label: "Vitals", href: "/dashboard/vitals" },
    { icon: <Clock size={18} />, label: "Timeline", href: "/dashboard/timeline" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        await logout().unwrap();
        router.push("/login");
    };

    return (
        <div className="w-60 bg-white shadow-md h-full flex flex-col">
            <h1 className="text-xl font-bold text-blue-600 p-5 border-b">HealthMate</h1>

            <nav className="flex-1 p-3 space-y-1">
                {menuItems.map((item, idx) => (
                    <Link key={idx} href={item.href}>
                        <div
                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer text-gray-700 
              ${pathname === item.href ? "bg-blue-100 text-blue-600 font-semibold" : "hover:bg-blue-50"}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </div>
                    </Link>
                ))}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 m-3 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
            >
                <LogOut size={18} /> Logout
            </button>
        </div>
    );
}
