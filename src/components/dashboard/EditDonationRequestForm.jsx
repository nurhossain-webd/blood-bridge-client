"use client";

import { useEffect, useState } from "react";
import axiosPublic from "@/lib/axiosPublic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar"],
  Chattogram: ["Pahartali", "Kotwali", "Halishahar"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Zakiganj"],
  Rajshahi: ["Boalia", "Paba", "Godagari"],
};

export default function EditDonationRequestForm({ id }) {
  const router = useRouter();

  const [request, setRequest] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadRequest = async () => {
      const res = await axiosPublic.get(`/donation-requests/${id}`);
      setRequest(res.data);
      setSelectedDistrict(res.data?.recipientDistrict || "");
      setLoading(false);
    };

    loadRequest();
  }, [id]);

  const handleChange = (e) => {
    setRequest({
      ...request,
      [e.target.name]: e.target.value,
    });
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;

    setSelectedDistrict(district);
    setRequest({
      ...request,
      recipientDistrict: district,
      recipientUpazila: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRequest = {
      recipientName: request.recipientName,
      recipientDistrict: request.recipientDistrict,
      recipientUpazila: request.recipientUpazila,
      hospitalName: request.hospitalName,
      fullAddress: request.fullAddress,
      bloodGroup: request.bloodGroup,
      donationDate: request.donationDate,
      donationTime: request.donationTime,
      requestMessage: request.requestMessage,
    };

    try {
      setUpdating(true);

      const res = await axiosPublic.patch(
        `/donation-requests/${id}`,
        updatedRequest
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Donation request updated");
        router.push("/dashboard/my-donation-requests");
      } else {
        toast("No changes made");
        router.push("/dashboard/my-donation-requests");
      }
    } catch (error) {
      toast.error("Failed to update request");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-red-700">Request not found</h1>
      </div>
    );
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Donation Request
        </h1>
        <p className="mt-2 text-gray-600">
          Update recipient and donation information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Requester Name</label>
          <input
            type="text"
            value={request.requesterName || ""}
            readOnly
            className="w-full rounded-xl border bg-gray-100 px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Requester Email</label>
          <input
            type="email"
            value={request.requesterEmail || ""}
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
            value={request.recipientName || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Blood Group</label>
          <select
            name="bloodGroup"
            required
            value={request.bloodGroup || ""}
            onChange={handleChange}
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
            value={request.recipientDistrict || ""}
            onChange={handleDistrictChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select district</option>
            {Object.keys(districts).map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Recipient Upazila</label>
          <select
            name="recipientUpazila"
            required
            value={request.recipientUpazila || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          >
            <option value="">Select upazila</option>
            {selectedDistrict &&
              districts[selectedDistrict]?.map((upazila) => (
                <option key={upazila} value={upazila}>
                  {upazila}
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
            value={request.hospitalName || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Full Address</label>
          <input
            name="fullAddress"
            type="text"
            required
            value={request.fullAddress || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Donation Date</label>
          <input
            name="donationDate"
            type="date"
            required
            value={request.donationDate || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Donation Time</label>
          <input
            name="donationTime"
            type="time"
            required
            value={request.donationTime || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block font-medium">Request Message</label>
          <textarea
            name="requestMessage"
            required
            rows="5"
            value={request.requestMessage || ""}
            onChange={handleChange}
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={updating}
          className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800 disabled:bg-red-300 md:col-span-2"
        >
          {updating ? "Updating..." : "Update Donation Request"}
        </button>
      </form>
    </section>
  );
}