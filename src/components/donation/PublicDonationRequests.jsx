"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosPublic from "@/lib/axiosPublic";

const limit = 10;

export default function PublicDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);

    const res = await axiosPublic.get("/donation-requests", {
      params: {
        status: "pending",
        page,
        limit,
      },
    });

    setRequests(res.data.requests || []);
    setTotalPages(res.data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [page]);

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
          <>
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

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </section>
    </main>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`rounded-lg border px-4 py-2 ${
              page === pageNumber
                ? "bg-red-700 text-white"
                : "bg-white hover:bg-red-50 hover:text-red-700"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border bg-white px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}