"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplet, HeartPulse, Search, ShieldCheck, Users, Menu } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-red-700">
            <Droplet />
            BloodBridge
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Link href="/donation-requests" className="font-medium text-gray-700 hover:text-red-700">
              Donation Requests
            </Link>
            <Link href="/search" className="font-medium text-gray-700 hover:text-red-700">
              Search Donors
            </Link>

            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="rounded-xl border px-5 py-2 font-semibold">
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="rounded-xl bg-red-700 px-5 py-2 font-semibold text-white">
                Login
              </Link>
            )}
          </div>

          <Menu className="md:hidden" />
        </div>
      </nav>

      <section className="bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
              Donate blood, save lives
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
              Connect donors with people who urgently need blood.
            </h1>

            <p className="mt-5 max-w-xl text-lg text-gray-600">
              BloodBridge helps donors and recipients find each other quickly through a secure and simple blood donation platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800">
                Join as a Donor
              </Link>
              <Link href="/search" className="rounded-xl border px-6 py-3 font-semibold text-gray-800 hover:border-red-700 hover:text-red-700">
                Search Donors
              </Link>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <HeartPulse className="text-red-700" size={64} />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Every donation matters
            </h2>
            <p className="mt-3 text-gray-600">
              A single blood donation can support patients during emergencies, surgeries, and critical treatments.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <MiniStat value="24/7" label="Requests" />
              <MiniStat value="8" label="Blood Groups" />
              <MiniStat value="Fast" label="Donor Search" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why BloodBridge?</h2>
            <p className="mt-3 text-gray-600">A simple platform for urgent blood donation support.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Feature icon={Search} title="Find Donors" text="Search active donors by blood group, district, and upazila." />
            <Feature icon={Droplet} title="Create Requests" text="Post blood donation requests with hospital and time details." />
            <Feature icon={ShieldCheck} title="Role Based Access" text="Admin, volunteer, and donor dashboards keep work organized." />
          </div>
        </div>
      </section>

      <section className="bg-red-50 px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
            <p className="mt-3 text-gray-600">
              Need support or want to collaborate with BloodBridge? Send us a message.
            </p>
            <p className="mt-6 font-semibold text-red-700">Emergency Support: +880 1234 567890</p>
          </div>

          <form className="rounded-3xl bg-white p-6 shadow">
            <input className="mb-4 w-full rounded-xl border px-4 py-3" placeholder="Your name" />
            <input className="mb-4 w-full rounded-xl border px-4 py-3" placeholder="Your email" />
            <textarea className="mb-4 w-full rounded-xl border px-4 py-3" rows="4" placeholder="Message"></textarea>
            <button className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-gray-950 px-4 py-10 text-white">
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
    </main>
  );
}

function MiniStat({ value, label }) {
  return (
    <div className="rounded-2xl bg-red-50 p-4 text-center">
      <p className="text-2xl font-bold text-red-700">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function Feature({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{text}</p>
    </div>
  );
}