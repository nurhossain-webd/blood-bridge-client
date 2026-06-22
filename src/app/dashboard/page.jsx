"use client";

import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function DashboardHomePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <p className="text-gray-600">Loading dashboard...</p>;
  }

  if (!session?.user) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-red-700">Access Denied</h2>
        <p className="mt-2 text-gray-600">Please login to access dashboard.</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-xl bg-red-700 px-5 py-2 text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {session.user.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your blood donation activities from here.
        </p>
      </div>
    </div>
  );
}