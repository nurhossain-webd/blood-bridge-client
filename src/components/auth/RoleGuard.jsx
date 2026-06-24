"use client";

import Link from "next/link";
import useDbUser from "@/hooks/useDbUser";

export default function RoleGuard({ allowedRoles = [], children }) {
  const { dbUser, loading } = useDbUser();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  if (!dbUser) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-red-700">Please Login</h1>
        <p className="mt-2 text-gray-600">
          You need to login to access this page.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-xl bg-red-700 px-5 py-3 font-semibold text-white"
        >
          Login
        </Link>
      </div>
    );
  }

  if (!allowedRoles.includes(dbUser.role)) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          You do not have permission to access this page.
        </p>
        <Link
          href="/dashboard"
          className="mt-5 inline-block rounded-xl bg-red-700 px-5 py-3 font-semibold text-white"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return children;
}