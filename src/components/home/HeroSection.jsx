import Link from "next/link";
import { HeartPulse } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat px-5 pb-16 pt-32 sm:px-6 lg:px-8"
     style={{
  backgroundImage:
    "linear-gradient(to right, rgba(255,255,255,0.82), rgba(255,255,255,0.55), rgba(255,245,245,0.30)), url('https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1600&q=80')",
}}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Donate blood, save lives
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            Connect donors with people who urgently need blood.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-gray-600">
            BloodBridge helps donors and recipients find each other quickly
            through a secure and simple blood donation platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="rounded-xl bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
            >
              Join as a Donor
            </Link>

            <Link
              href="/search"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:border-red-700 hover:text-red-700"
            >
              Search Donors
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-8">
          <HeartPulse className="text-red-700" size={64} />

          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Every donation matters
          </h2>

          <p className="mt-3 text-gray-600">
            A single blood donation can support patients during emergencies,
            surgeries, and critical treatments.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <MiniStat value="500+" label="Active Donors" />
            <MiniStat value="24/7" label="Support" />
            <MiniStat value="2K+" label="Donations / Month" />
          </div>
        </div>
      </div>
    </section>
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