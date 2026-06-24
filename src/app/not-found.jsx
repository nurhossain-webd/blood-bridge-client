import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-rose-50 px-5">
      <section className="max-w-xl rounded-3xl bg-white p-10 text-center shadow-xl">
        <HeartPulse className="mx-auto text-red-700" size={64} />

        <h1 className="mt-6 text-5xl font-bold text-gray-900">404</h1>

        <h2 className="mt-3 text-2xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-3 text-gray-600">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}