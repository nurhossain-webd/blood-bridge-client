"use client";

import { useSession } from "@/lib/auth-client";
import useDbUser from "@/hooks/useDbUser";
import Link from "next/link";

export default function DashboardHomePage() {
  const { data: session, isPending } = useSession();
  const { dbUser, loading } = useDbUser();

  if (isPending || loading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow">
        <h2 className="text-2xl font-bold text-red-700">
          Access Denied
        </h2>

        <p className="mt-2 text-gray-600">
          Please login to access dashboard.
        </p>

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
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">
          Welcome, {session.user.name}
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your blood donation activities from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="font-bold">Role</h3>
          <p>{dbUser?.role}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="font-bold">Status</h3>
          <p>{dbUser?.status}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h3 className="font-bold">Email</h3>
          <p>{dbUser?.email}</p>
        </div>
      </div>

      {dbUser?.role === "admin" && (
        <div className="rounded-xl bg-red-100 p-5">
          Admin Dashboard
        </div>
      )}

      {dbUser?.role === "volunteer" && (
        <div className="rounded-xl bg-blue-100 p-5">
          Volunteer Dashboard
        </div>
      )}

      {dbUser?.role === "donor" && (
        <div className="rounded-xl bg-green-100 p-5">
          Donor Dashboard
        </div>
      )}
    </div>
  );
}