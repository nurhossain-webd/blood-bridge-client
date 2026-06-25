"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axiosPublic from "@/lib/axiosPublic";
import { CalendarDays, Clock, Droplet, MapPin, Search } from "lucide-react";

const limit = 10;

export default function PublicDonationRequests() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);

    try {
      const res = await axiosPublic.get("/donation-requests", {
        params: {
          status: "pending",
          page,
          limit,
        },
      });

      setRequests(res.data.requests || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-100 border-t-red-600"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/40 px-4 py-12">
      <section className="mx-auto max-w-7xl">
        <div className="mb-10 rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm md:p-12">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            <Droplet size={18} />
            Urgent Blood Requests
          </span>

          <h1 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Blood Donation Requests
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Browse pending blood donation requests and help someone receive
            urgent support at the right time.
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-700">
              <Search size={30} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No pending request found
            </h2>

            <p className="mt-2 text-gray-600">
              Please check again later for new blood donation requests.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {requests.map((request) => (
                <div
                  key={request._id}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="border-b bg-white p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-red-50 px-4 py-1 text-sm font-bold text-red-700">
                        {request.bloodGroup}
                      </span>

                      <span className="rounded-full bg-amber-50 px-4 py-1 text-sm font-medium capitalize text-amber-700">
                        {request.donationStatus}
                      </span>
                    </div>

                    <h2 className="mt-5 text-2xl font-bold text-gray-900">
                      {request.recipientName}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Blood needed urgently
                    </p>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="space-y-4 text-gray-700">
                      <Info
                        icon={MapPin}
                        label="Location"
                        value={`${request.recipientDistrict}, ${request.recipientUpazila}`}
                      />

                      <Info
                        icon={CalendarDays}
                        label="Date"
                        value={request.donationDate}
                      />

                      <Info
                        icon={Clock}
                        label="Time"
                        value={request.donationTime}
                      />
                    </div>

                    <Link
                      href={`/donation-requests/${request._id}`}
                      className="mt-6 rounded-xl bg-red-700 px-5 py-3 text-center font-semibold text-white transition hover:bg-red-800"
                    >
                      View Details
                    </Link>
                  </div>
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

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-red-50 p-4">
      <div className="mt-1 text-red-700">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="rounded-xl border bg-white px-5 py-2 font-semibold text-gray-700 transition hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        Prev
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            className={`rounded-xl border px-4 py-2 font-semibold transition ${
              page === pageNumber
                ? "border-red-700 bg-red-700 text-white"
                : "bg-white text-gray-700 hover:border-red-700 hover:text-red-700"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="rounded-xl border bg-white px-5 py-2 font-semibold text-gray-700 transition hover:border-red-700 hover:text-red-700 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}