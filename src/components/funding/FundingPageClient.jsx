"use client";

import { useEffect, useState } from "react";
import axiosPublic from "@/lib/axiosPublic";
import useDbUser from "@/hooks/useDbUser";
import FundingModal from "./FundingModal";

export default function FundingPageClient() {
  const { dbUser, loading: userLoading } = useDbUser();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadFunds = async () => {
    setLoading(true);
    const res = await axiosPublic.get("/funds");
    setFunds(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!userLoading && dbUser?.email) {
      loadFunds();
    }
  }, [userLoading, dbUser?.email]);

  const totalAmount = funds.reduce(
    (sum, fund) => sum + Number(fund.amount || 0),
    0
  );

  if (userLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Funding</h1>
            <p className="mt-2 text-gray-600">
              Support BloodBridge organization with a small donation.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Give Fund
          </button>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-6 shadow">
          <p className="text-gray-600">Total Funding</p>
          <h2 className="mt-2 text-4xl font-bold text-red-700">
            €{totalAmount}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-red-50 text-sm text-gray-700">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Transaction ID</th>
              </tr>
            </thead>

            <tbody>
              {funds.map((fund) => (
                <tr key={fund._id} className="border-t text-sm">
                  <td className="p-4 font-semibold">{fund.name}</td>
                  <td className="p-4">{fund.email}</td>
                  <td className="p-4 font-bold text-red-700">
                    €{fund.amount}
                  </td>
                  <td className="p-4">
                    {new Date(fund.fundingDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-xs text-gray-500">
                    {fund.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {funds.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed bg-white p-8 text-center text-gray-600">
            No funding record found.
          </div>
        )}
      </section>

      {modalOpen && (
        <FundingModal
          dbUser={dbUser}
          closeModal={() => setModalOpen(false)}
          refetch={loadFunds}
        />
      )}
    </main>
  );
}