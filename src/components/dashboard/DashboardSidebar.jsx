"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  HeartHandshake,
  PlusCircle,
  LogOut,
  Users,
  Droplets,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import useDbUser from "@/hooks/useDbUser";
import toast from "react-hot-toast";
import axiosPublic from "@/lib/axiosPublic";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { dbUser, loading } = useDbUser();

  const donorLinks = [
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

  const adminLinks = [
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
      label: "All Users",
      href: "/dashboard/all-users",
      icon: Users,
    },
    {
      label: "All Blood Requests",
      href: "/dashboard/all-blood-donation-request",
      icon: Droplets,
    },
  ];

  const volunteerLinks = [
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
      label: "All Blood Requests",
      href: "/dashboard/all-blood-donation-request",
      icon: Droplets,
    },
  ];

  let menuItems = donorLinks;

  if (dbUser?.role === "admin") {
    menuItems = adminLinks;
  }

  if (dbUser?.role === "volunteer") {
    menuItems = volunteerLinks;
  }

 const handleLogout = async () => {
  try {
    await axiosPublic.post("/logout");
    await authClient.signOut();
    localStorage.removeItem("access_token");

    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  } catch (error) {
    console.error(error);
    toast.error("Logout failed");
  }
};

  return (
    <aside className="w-full border-b bg-white p-4 shadow-sm lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <Link href="/" className="block text-2xl font-bold text-red-700">
        BloodBridge
      </Link>

      <div className="mt-4 rounded-2xl bg-red-50 p-4">
        {loading ? (
          <p className="text-sm text-gray-500">Loading user...</p>
        ) : (
          <>
            <p className="font-semibold text-gray-900">{dbUser?.name}</p>
            <p className="text-sm text-gray-500">{dbUser?.email}</p>
            <div className="mt-2 flex gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {dbUser?.role}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  dbUser?.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {dbUser?.status}
              </span>
            </div>
          </>
        )}
      </div>

      <nav className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                active
                  ? "bg-red-700 text-white"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-700"
              }`}
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