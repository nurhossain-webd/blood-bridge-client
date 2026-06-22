"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosPublic from "@/lib/axiosPublic";
import Link from "next/link";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const statuses = ["pending", "inprogress", "done", "canceled"];

export default function MyDonationRequestsTable() {
  const { data: session, isPending } = useSession();
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!session?.user?.email) return;

    setLoading(true);

    const query = statusFilter
      ? `/donation-requests?email=${session.user.email}&status=${statusFilter}`
      : `/donation-requests?email=${session.user.email}`;

    const res = await axiosPublic.get(query);
    setRequests(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, [session?.user?.email, statusFilter]);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This donation request will be deleted permanently.",
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

  const handleStatusChange = async (id, status) => {
    const res = await axiosPublic.patch(`/donation-requests/status/${id}`, {
      status,
    });

    if (res.data.modifiedCount > 0) {
      toast.success(`Request marked as ${status}`);
      loadRequests();
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Donation Requests
          </h1>
          <p className="mt-1 text-gray-600">
            Manage all donation requests created by you.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
        >
          <option value="">All Status</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center">
          <p className="text-gray-600">No donation request found.</p>
          <Link
            href="/dashboard/create-donation-request"
            className="mt-4 inline-block rounded-xl bg-red-700 px-5 py-2 font-semibold text-white"
          >
            Create Request
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-red-50 text-left text-sm text-gray-700">
                <th className="p-4">Recipient</th>
                <th className="p-4">Location</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Blood</th>
                <th className="p-4">Status</th>
                <th className="p-4">Donor Info</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b text-sm">
                  <td className="p-4 font-medium">{request.recipientName}</td>
                  <td className="p-4">
                    {request.recipientDistrict}, {request.recipientUpazila}
                  </td>
                  <td className="p-4">{request.donationDate}</td>
                  <td className="p-4">{request.donationTime}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-red-100 px-3 py-1 font-semibold text-red-700">
                      {request.bloodGroup}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-gray-100 px-3 py-1">
                      {request.donationStatus}
                    </span>

                    {request.donationStatus === "inprogress" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusChange(request._id, "done")
                          }
                          className="rounded-lg bg-green-600 px-3 py-1 text-xs text-white"
                        >
                          Done
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(request._id, "canceled")
                          }
                          className="rounded-lg bg-gray-700 px-3 py-1 text-xs text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    {request.donationStatus === "inprogress" ? (
                      <div>
                        <p>{request.donorName}</p>
                        <p className="text-gray-500">{request.donorEmail}</p>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/donation-requests/${request._id}`}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-xs text-white"
                      >
                        View
                      </Link>

                      <Link
                        href={`/dashboard/edit-donation-request/${request._id}`}
                        className="rounded-lg bg-yellow-500 px-3 py-1 text-xs text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(request._id)}
                        className="rounded-lg bg-red-700 px-3 py-1 text-xs text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}