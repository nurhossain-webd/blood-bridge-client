"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import axiosPublic from "@/lib/axiosPublic";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DonationRequestDetails({ id }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [request, setRequest] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donating, setDonating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    const requestRes = await axiosPublic.get(`/donation-requests/${id}`);
    setRequest(requestRes.data);

    if (session?.user?.email) {
      const userRes = await axiosPublic.get(`/users/${session.user.email}`);
      setDbUser(userRes.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!isPending) {
      loadData();
    }
  }, [id, isPending, session?.user?.email]);

  const handleDonateConfirm = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      setDonating(true);

      const res = await axiosPublic.patch(`/donation-requests/donate/${id}`, {
        donorName: dbUser?.name || session.user.name,
        donorEmail: dbUser?.email || session.user.email,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Donation confirmed successfully");
        setModalOpen(false);
        loadData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Donation failed");
    } finally {
      setDonating(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-red-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </main>
    );
  }

  if (!request) {
    return (
      <main className="min-h-screen bg-red-50 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-bold text-red-700">
            Donation request not found
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-xl md:p-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Blood Needed for {request.recipientName}
            </h1>
            <p className="mt-2 text-gray-600">
              Please review the full request information before confirming
              donation.
            </p>
          </div>

          <span className="w-fit rounded-full bg-red-100 px-5 py-2 font-bold text-red-700">
            {request.bloodGroup}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Info title="Recipient Name" value={request.recipientName} />
          <Info title="Blood Group" value={request.bloodGroup} />
          <Info
            title="Location"
            value={`${request.recipientDistrict}, ${request.recipientUpazila}`}
          />
          <Info title="Hospital" value={request.hospitalName} />
          <Info title="Full Address" value={request.fullAddress} />
          <Info title="Donation Date" value={request.donationDate} />
          <Info title="Donation Time" value={request.donationTime} />
          <Info title="Status" value={request.donationStatus} />
          <Info title="Requester Name" value={request.requesterName} />
          <Info title="Requester Email" value={request.requesterEmail} />
        </div>

        <div className="mt-6 rounded-2xl bg-red-50 p-5">
          <h3 className="mb-2 font-bold text-gray-900">Request Message</h3>
          <p className="leading-relaxed text-gray-700">
            {request.requestMessage}
          </p>
        </div>

        {request.donationStatus === "inprogress" && (
          <div className="mt-6 rounded-2xl bg-green-50 p-5">
            <h3 className="mb-2 font-bold text-green-800">Donor Information</h3>
            <p>{request.donorName}</p>
            <p className="text-gray-600">{request.donorEmail}</p>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          {request.donationStatus === "pending" ? (
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
            >
              Donate
            </button>
          ) : (
            <button
              disabled
              className="rounded-xl bg-gray-300 px-6 py-3 font-semibold text-gray-600"
            >
              Donation Not Available
            </button>
          )}

          <button
            onClick={() => router.back()}
            className="rounded-xl border px-6 py-3 font-semibold text-gray-700"
          >
            Go Back
          </button>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Confirm Donation
            </h2>
            <p className="mt-2 text-gray-600">
              Your name and email will be shared with the requester.
            </p>

            <form onSubmit={handleDonateConfirm} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block font-medium">Donor Name</label>
                <input
                  value={dbUser?.name || session?.user?.name || ""}
                  readOnly
                  className="w-full rounded-xl border bg-gray-100 px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">Donor Email</label>
                <input
                  value={dbUser?.email || session?.user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border bg-gray-100 px-4 py-3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={donating}
                  className="flex-1 rounded-xl bg-red-700 px-5 py-3 font-semibold text-white disabled:bg-red-300"
                >
                  {donating ? "Confirming..." : "Confirm"}
                </button>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border px-5 py-3 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Info({ title, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 font-semibold text-gray-900">{value || "N/A"}</p>
    </div>
  );
}