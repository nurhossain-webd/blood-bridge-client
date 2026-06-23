"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import axiosPublic from "@/lib/axiosPublic";
import useDbUser from "@/hooks/useDbUser";

const statuses = ["pending", "inprogress", "done", "canceled"];

export default function AllBloodDonationRequests() {
  const { dbUser, loading: userLoading } = useDbUser();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);

    const url = statusFilter
      ? `/donation-requests?status=${statusFilter}`
      : "/donation-requests";

    const res = await axiosPublic.get(url);
    setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    const res = await axiosPublic.patch(`/donation-requests/status/${id}`, {
      status,
    });

    if (res.data.modifiedCount > 0) {
      toast.success(`Status updated to ${status}`);
      loadRequests();
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This request will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (confirm.isConfirmed) {
      const res = await axiosPublic.delete(`/donation-requests/${id}`);

      if (res.data.deletedCount > 0) {
        toast.success("Donation request deleted");
        loadRequests();
      }
    }
  };

  if (loading || userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  if (dbUser?.role !== "admin" && dbUser?.role !== "volunteer") {
    return (
      <section className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-red-700">Access Denied</h1>
        <p className="mt-2 text-gray-600">
          Only admin and volunteer can access this page.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-4 shadow md:p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            All Blood Donation Requests
          </h1>
          <p className="mt-1 text-sm text-gray-600 md:text-base">
            Admin can manage all requests. Volunteer can update status only.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500 md:w-auto"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile / Tablet Cards */}
      <div className="grid gap-4 xl:hidden">
        {requests.map((request) => (
          <div key={request._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {request.recipientName}
                </h2>
                <p className="text-sm text-gray-500">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                {request.bloodGroup}
              </span>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Requester" value={request.requesterName} />
              <Info label="Requester Email" value={request.requesterEmail} />
              <Info label="Date" value={request.donationDate} />
              <Info label="Time" value={request.donationTime} />

              <div>
                <p className="text-xs font-medium text-gray-500">Status</p>
                <select
                  value={request.donationStatus}
                  onChange={(e) =>
                    handleStatusChange(request._id, e.target.value)
                  }
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-red-500"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500">Donor</p>
                {request.donorEmail ? (
                  <div className="mt-1">
                    <p className="font-medium text-gray-900">{request.donorName}</p>
                    <p className="break-all text-xs text-gray-500">
                      {request.donorEmail}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-gray-400">N/A</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/donation-requests/${request._id}`}
                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
              >
                View
              </Link>

              {dbUser?.role === "admin" && (
                <>
                  <Link
                    href={`/dashboard/edit-donation-request/${request._id}`}
                    className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(request._id)}
                    className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto rounded-2xl border xl:block">
        <table className="w-full min-w-[1150px] border-collapse text-left">
          <thead className="bg-red-50 text-sm text-gray-700">
            <tr>
              <th className="p-4">Recipient</th>
              <th className="p-4">Requester</th>
              <th className="p-4">Location</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Blood</th>
              <th className="p-4">Status</th>
              <th className="p-4">Donor</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request._id} className="border-t text-sm">
                <td className="p-4 font-semibold text-gray-900">
                  {request.recipientName}
                </td>

                <td className="p-4">
                  <p className="font-medium">{request.requesterName}</p>
                  <p className="break-all text-xs text-gray-500">
                    {request.requesterEmail}
                  </p>
                </td>

                <td className="p-4">
                  {request.recipientDistrict}, {request.recipientUpazila}
                </td>

                <td className="p-4">{request.donationDate}</td>
                <td className="p-4">{request.donationTime}</td>

                <td className="p-4">
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                    {request.bloodGroup}
                  </span>
                </td>

                <td className="p-4">
                  <select
                    value={request.donationStatus}
                    onChange={(e) =>
                      handleStatusChange(request._id, e.target.value)
                    }
                    className="rounded-lg border px-3 py-2 text-xs outline-none focus:border-red-500"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="p-4">
                  {request.donorEmail ? (
                    <div>
                      <p className="font-medium">{request.donorName}</p>
                      <p className="break-all text-xs text-gray-500">
                        {request.donorEmail}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/donation-requests/${request._id}`}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white"
                    >
                      View
                    </Link>

                    {dbUser?.role === "admin" && (
                      <>
                        <Link
                          href={`/dashboard/edit-donation-request/${request._id}`}
                          className="rounded-lg bg-yellow-500 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(request._id)}
                          className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {requests.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-gray-600">
          No blood donation request found.
        </div>
      )}
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 break-words font-medium text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}