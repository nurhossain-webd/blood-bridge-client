"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosPublic from "@/lib/axiosPublic";

export default function CheckoutForm({ dbUser, closeModal, refetch }) {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    if (!amount || Number(amount) < 1) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      setProcessing(true);

      const intentRes = await axiosPublic.post("/create-payment-intent", {
        amount: Number(amount),
      });

      const card = elements.getElement(CardElement);

      const paymentRes = await stripe.confirmCardPayment(
        intentRes.data.clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: dbUser?.name,
              email: dbUser?.email,
            },
          },
        }
      );

      if (paymentRes.error) {
        toast.error(paymentRes.error.message);
        return;
      }

      if (paymentRes.paymentIntent.status === "succeeded") {
        await axiosPublic.post("/funds", {
          name: dbUser?.name,
          email: dbUser?.email,
          amount: Number(amount),
          transactionId: paymentRes.paymentIntent.id,
        });

        toast.success("Funding successful");
        refetch();
        closeModal();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-5">
      <div>
        <label className="mb-2 block font-medium text-gray-700">Name</label>
        <input
          value={dbUser?.name || ""}
          readOnly
          className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-800"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">Email</label>
        <input
          value={dbUser?.email || ""}
          readOnly
          className="w-full rounded-xl border bg-gray-100 px-4 py-3 text-gray-800"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Amount (€)
        </label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 outline-none focus:border-red-500"
          placeholder="Example: 5"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-gray-700">
          Card Information
        </label>

        <div className="rounded-xl border p-4">
          <CardElement />
        </div>

        <div className="mt-3 rounded-xl bg-red-50 p-4 text-sm text-gray-700">
          <p className="font-semibold text-red-700">Use Stripe test card:</p>
          <p className="mt-1">Card: 4242 4242 4242 4242</p>
          <p>Expiry: 12 / 34</p>
          <p>CVC: 123</p>
          <p>ZIP: 12345</p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800 disabled:bg-red-300"
      >
        {processing ? "Processing..." : `Pay €${amount || 0}`}
      </button>
    </form>
  );
}