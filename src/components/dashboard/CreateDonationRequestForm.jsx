"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosPublic from "@/lib/axiosPublic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import districtsData from "@/data/districts.json";
import upazilasData from "@/data/upazilas.json";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function CreateDonationRequestForm() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [dbUser, setDbUser] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const districts =
    districtsData[2]?.data || districtsData.data || districtsData;
  const upazilas =
    upazilasData[2]?.data || upazilasData.data || upazilasData;

  const filteredUpazilas = useMemo(() => {
    const district = districts.find((item) => item.name === selectedDistrict);
    if (!district) return [];

    return upazilas.filter(
      (upazila) => String(upazila.district_id) === String(district.id)
    );
  }, [selectedDistrict, districts, upazilas]);

  useEffect(() => {
    const loadUser = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await axiosPublic.get(`/users/${session.user.email}`);
        setDbUser(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setUserLoading(false);
      }
    };

    loadUser();
  }, [session?.user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dbUser) {
      toast.error("User information not found");
      return;
    }

    if (dbUser.status === "blocked") {
      toast.error("Blocked user cannot create donation request");
      return;
    }

    const form = e.target;

    const donationRequest = {
      requesterName: dbUser.name,
      requesterEmail: dbUser.email,
      recipientName: form.recipientName.value,
      recipientDistrict: form.recipientDistrict.value,
      recipientUpazila: form.recipientUpazila.value,
      hospitalName: form.hospitalName.value,
      fullAddress: form.fullAddress.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.donationDate.value,
      donationTime: form.donationTime.value,
      requestMessage: form.requestMessage.value,
    };

    try {
      setLoading(true);

      const res = await axiosPublic.post("/donation-requests", donationRequest);

      if (res.data.insertedId) {
        toast.success("Donation request created successfully");
        form.reset();
        setSelectedDistrict("");
        router.push("/dashboard/my-donation-requests");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || userLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Donation Request
        </h1>
        <p className="mt-2 text-gray-600">
          Fill the information carefully so donors can find the recipient.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Requester Name</label>
          <input
            type="text"
            value={dbUser?.name || ""}
            readOnly
            className="w-full rounded-xl border bg-gray-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Requester Email</label>
          <input
            type="email"
            value={dbUser?.email || ""}
            readOnly
            className="w-full rounded-xl border bg-gray-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Recipient Name</label>
          <input
            name="recipientName"
            type="text"
            required
            placeholder="Recipient full name"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select blood group</option>
            {bloodGroups.map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Recipient District</label>
          <select
            name="recipientDistrict"
            required
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select district</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Recipient Upazila</label>
          <select
            name="recipientUpazila"
            required
            disabled={!selectedDistrict}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500 disabled:bg-gray-100"
          >
            <option value="">Select upazila</option>
            {filteredUpazilas.map((upazila) => (
              <option key={upazila.id} value={upazila.name}>
                {upazila.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Hospital Name</label>
          <input
            name="hospitalName"
            type="text"
            required
            placeholder="Example: Dhaka Medical College Hospital"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Full Address</label>
          <input
            name="fullAddress"
            type="text"
            required
            placeholder="Example: Zahir Raihan Rd, Dhaka"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Donation Date</label>
          <input
            name="donationDate"
            type="date"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Donation Time</label>
          <input
            name="donationTime"
            type="time"
            required
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Request Message</label>
          <textarea
            name="requestMessage"
            required
            rows="5"
            placeholder="Explain why blood is needed..."
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:bg-red-300 md:col-span-2"
        >
          {loading ? "Creating Request..." : "Request"}
        </button>
      </form>
    </section>
  );
}