import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 px-5 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-2xl font-bold text-red-500">BloodBridge</p>
        <div className="flex flex-wrap gap-5 text-sm text-gray-300">
          <Link href="/donation-requests">Donation Requests</Link>
          <Link href="/search">Search Donors</Link>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </div>
      </div>
    </footer>
  );
}