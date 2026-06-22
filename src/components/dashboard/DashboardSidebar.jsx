"use client";

import Link from "next/link";
import { LayoutDashboard, User, HeartHandshake, PlusCircle, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    label: "My Requests",
    href: "/dashboard/my-donation-requests",
    icon: HeartHandshake,
  },
  {
    label: "Create Request",
    href: "/dashboard/create-donation-request",
    icon: PlusCircle,
  },
];

export default function DashboardSidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="w-full border-b bg-white p-4 shadow-sm lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <Link href="/" className="block text-2xl font-bold text-red-700">
        BloodBridge
      </Link>

      <nav className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-red-50 hover:text-red-700"
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-700 transition hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  );
}