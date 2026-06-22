"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosPublic from "@/lib/axiosPublic";
import toast from "react-hot-toast";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar"],
  Chattogram: ["Pahartali", "Kotwali", "Halishahar"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Zakiganj"],
  Rajshahi: ["Boalia", "Paba", "Godagari"],
};

export default function ProfileForm() {
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user?.email) return;

      const res = await axiosPublic.get(`/users/${session.user.email}`);
      setUser(res.data);
      setLoading(false);
    };

    loadUser();
  }, [session?.user?.email]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const res = await axiosPublic.patch(`/users/${user.email}`, user);

    if (res.data.modifiedCount > 0) {
      toast.success("Profile updated successfully");
      setEditable(false);
    } else {
      toast("No changes made");
      setEditable(false);
    }
  };

 if (isPending || loading) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
    </div>
  );
}

  if (!user) {
    return <p>User profile not found.</p>;
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-1 text-gray-600">View and update your information.</p>
        </div>

        {!editable && (
          <button
            onClick={() => setEditable(true)}
            className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Name</label>
          <input
            name="name"
            value={user.name || ""}
            disabled={!editable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Email</label>
          <input
            value={user.email || ""}
            disabled
            className="w-full rounded-xl border bg-gray-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Avatar URL</label>
          <input
            name="avatar"
            value={user.avatar || ""}
            disabled={!editable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            value={user.bloodGroup || ""}
            disabled={!editable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
          >
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">District</label>
          <select
            name="district"
            value={user.district || ""}
            disabled={!editable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
          >
            {Object.keys(districts).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Upazila</label>
          <select
            name="upazila"
            value={user.upazila || ""}
            disabled={!editable}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100"
          >
            {districts[user.district]?.map((upazila) => (
              <option key={upazila} value={upazila}>
                {upazila}
              </option>
            ))}
          </select>
        </div>

        {editable && (
          <button className="rounded-xl bg-red-700 px-5 py-3 font-semibold text-white md:col-span-2">
            Save Changes
          </button>
        )}
      </form>
    </section>
  );
}