import { Droplet, Search, ShieldCheck } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Why BloodBridge?</h2>
          <p className="mt-3 text-gray-600">
            A simple platform for urgent blood donation support.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Feature icon={Search} title="Find Donors" text="Search active donors by blood group, district, and upazila." />
          <Feature icon={Droplet} title="Create Requests" text="Post blood donation requests with hospital and time details." />
          <Feature icon={ShieldCheck} title="Role Based Access" text="Admin, volunteer, and donor dashboards keep work organized." />
        </div>
      </div>
    </section>
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