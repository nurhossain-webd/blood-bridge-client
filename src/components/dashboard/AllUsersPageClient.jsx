"use client";

import { useEffect, useState } from "react";
import axiosPublic from "@/lib/axiosPublic";
import toast from "react-hot-toast";

const limit = 10;

export default function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosPublic.get("/users", {
        params: {
          status: statusFilter || undefined,
          page,
          limit,
        },
      });

      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [statusFilter, page]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const updateRole = async (id, role) => {
    const res = await axiosPublic.patch(`/users/role/${id}`, { role });

    if (res.data.modifiedCount > 0) {
      toast.success(`User is now ${role}`);
      loadUsers();
    }
  };

  const updateStatus = async (id, status) => {
    const res = await axiosPublic.patch(`/users/status/${id}`, { status });

    if (res.data.modifiedCount > 0) {
      toast.success(`User ${status}`);
      loadUsers();
    }
  };

  if (loading) {
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
          <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
          <p className="mt-1 text-gray-600">
            Manage users, roles, and account status.
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-red-500"
        >
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-red-50 text-sm text-gray-700">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Role Actions</th>
              <th className="p-4">Status Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t text-sm">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || "/avatar.png"}
                      alt={user.name}
                      className="h-11 w-11 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.bloodGroup || "No blood group"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="p-4 text-gray-700">{user.email}</td>

                <td className="p-4">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      disabled={user.role === "donor"}
                      onClick={() => updateRole(user._id, "donor")}
                      className="rounded-lg bg-gray-700 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Donor
                    </button>

                    <button
                      disabled={user.role === "volunteer"}
                      onClick={() => updateRole(user._id, "volunteer")}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Volunteer
                    </button>

                    <button
                      disabled={user.role === "admin"}
                      onClick={() => updateRole(user._id, "admin")}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Admin
                    </button>
                  </div>
                </td>

                <td className="p-4">
                  {user.status === "active" ? (
                    <button
                      onClick={() => updateStatus(user._id, "blocked")}
                      className="rounded-lg bg-red-700 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(user._id, "active")}
                      className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white"
                    >
                      Unblock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-gray-600">
          No user found.
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </section>
  );
}

function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
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
                : "hover:bg-red-50 hover:text-red-700"
            }`}
          >
            {pageNumber}
          </button>
        );
      })}

      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        Next
      </button>
    </div>
  );
}