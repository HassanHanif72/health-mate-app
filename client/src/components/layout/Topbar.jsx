"use client";
import { User } from "lucide-react";

export default function Topbar() {
  return (
    <header className="bg-white px-6 py-4 shadow-sm flex justify-end">
      <div className="flex items-center gap-2 cursor-pointer">
        <User size={20} className="text-blue-600" />
        <span className="font-medium">My Account</span>
      </div>
    </header>
  );
}
