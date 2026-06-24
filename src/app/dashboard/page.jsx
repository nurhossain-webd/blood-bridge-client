"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Droplets, HandCoins, HeartPulse } from "lucide-react";
import useDbUser from "@/hooks/useDbUser";
import axiosPublic from "@/lib/axiosPublic";

export default function DashboardHomePage() {
  const { dbUser, loading: userLoading } = useDbUser();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!dbUser?.email) return;

      const statsRes = await axiosPublic.get("/dashboard-stats");
      setStats(statsRes.data);

      if (dbUser.role === "donor") {
        const recentRes = await axiosPublic.get(
          `/donation-requests?email=${dbUser.email}&limit=3`
        );
        setRecentRequests(recentRes.data);
      }

      setLoading(false);
    };

    if (!userLoading) {
      loadDashboardData();
    }
  }, [dbUser?.email, dbUser?.role, userLoading]);

  if (userLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {dbUser?.name}
        </h1>
        <p className="mt-2 text-gray-600">
          You are logged in as{" "}
          <span className="font-semibold text-red-700">{dbUser?.role}</span>.
        </p>
      </div>

      {(dbUser?.role === "admin" || dbUser?.role === "volunteer") && (
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats?.totalUsers || 0}
          />
          <StatCard
            icon={HandCoins}
            title="Total Funding"
            value={`€${stats?.totalFunding || 0}`}
          />
          <StatCard
            icon={Droplets}
            title="Donation Requests"
            value={stats?.totalDonationRequests || 0}
          />
        </div>
      )}

      {dbUser?.role === "donor" && recentRequests.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Donation Requests
              </h2>
              <p className="text-gray-600">
                Your latest 3 blood donation requests.
              </p>
            </div>

            <Link
              href="/dashboard/my-donation-requests"
              className="rounded-xl bg-red-700 px-5 py-2 text-center font-semibold text-white"
            >
              View My All Request
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {recentRequests.map((request) => (
              <div key={request._id} className="rounded-2xl border p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    {request.bloodGroup}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                    {request.donationStatus}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900">
                  {request.recipientName}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  {request.donationDate} at {request.donationTime}
                </p>

                <Link
                  href={`/donation-requests/${request._id}`}
                  className="mt-4 inline-block rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {dbUser?.role === "donor" && recentRequests.length === 0 && (
        <div className="rounded-3xl bg-white p-8 text-center shadow">
          <HeartPulse className="mx-auto text-red-700" size={48} />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            No donation request yet
          </h2>
          <p className="mt-2 text-gray-600">
            Create your first donation request from the dashboard.
          </p>
          <Link
            href="/dashboard/create-donation-request"
            className="mt-5 inline-block rounded-xl bg-red-700 px-5 py-3 font-semibold text-white"
          >
            Create Request
          </Link>
        </div>
      )}
    </section>
  );
}

function StatCard({ icon: Icon, title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <Icon size={24} />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="mt-1 text-gray-600">{title}</p>
    </div>
  );
}