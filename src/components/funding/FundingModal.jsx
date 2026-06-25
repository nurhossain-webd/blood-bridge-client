"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function FundingModal({ dbUser, closeModal, refetch }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Give Fund</h2>
          <button
            onClick={closeModal}
            className="rounded-full bg-gray-100 px-3 py-1 text-gray-700"
          >
            ✕
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <CheckoutForm
            dbUser={dbUser}
            closeModal={closeModal}
            refetch={refetch}
          />
        </Elements>
      </div>
    </div>
  );
}