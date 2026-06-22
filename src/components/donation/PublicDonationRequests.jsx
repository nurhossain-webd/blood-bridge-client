"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosPublic from "@/lib/axiosPublic";

export default function PublicDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      const res = await axiosPublic.get("/donation-requests?status=pending");
      setRequests(res.data);
      setLoading(false);
    };

    loadRequests();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Blood Donation Requests
          </h1>
          <p className="mt-3 text-gray-600">
            Find pending blood requests and help someone in need.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              No pending request found
            </h2>
            <p className="mt-2 text-gray-600">
              Please check again later for new blood donation requests.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request._id}
                className="flex h-full flex-col rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-red-100 px-4 py-1 text-sm font-bold text-red-700">
                    {request.bloodGroup}
                  </span>

                  <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm font-medium text-yellow-700">
                    {request.donationStatus}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {request.recipientName}
                </h2>

                <div className="mt-4 space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold text-gray-800">
                      Location:
                    </span>{" "}
                    {request.recipientDistrict}, {request.recipientUpazila}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-800">Date:</span>{" "}
                    {request.donationDate}
                  </p>

                  <p>
                    <span className="font-semibold text-gray-800">Time:</span>{" "}
                    {request.donationTime}
                  </p>
                </div>

                <Link
                  href={`/donation-requests/${request._id}`}
                  className="mt-6 inline-block rounded-xl bg-red-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-800"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}