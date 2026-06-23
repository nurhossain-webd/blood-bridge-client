"use client";

import { useState } from "react";
import axiosPublic from "@/lib/axiosPublic";
import { ChevronDown, Droplet, MapPin, Search } from "lucide-react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const districts = {
  Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar"],
  Chattogram: ["Pahartali", "Kotwali", "Halishahar"],
  Sylhet: ["Sylhet Sadar", "Beanibazar", "Zakiganj"],
  Rajshahi: ["Boalia", "Paba", "Godagari"],
};

export default function SearchDonors() {
  const [form, setForm] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateField = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "district" ? { upazila: "" } : {}),
    }));
    setOpenDropdown(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSearched(true);

    const res = await axiosPublic.get(
      `/donors/search?bloodGroup=${form.bloodGroup}&district=${form.district}&upazila=${form.upazila}`
    );

    setDonors(res.data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            BloodBridge Donor Finder
          </span>
          <h1 className="mt-5 text-4xl font-bold text-gray-900 md:text-5xl">
            Search Donors
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Find active blood donors by blood group, district, and upazila.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="rounded-3xl bg-white p-5 shadow-xl md:p-7"
        >
          <div className="grid gap-4 lg:grid-cols-4">
            <CustomSelect
              label="Blood Group"
              icon={<Droplet size={18} />}
              value={form.bloodGroup}
              placeholder="Select blood group"
              options={bloodGroups}
              open={openDropdown === "bloodGroup"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "bloodGroup" ? null : "bloodGroup")
              }
              onSelect={(value) => updateField("bloodGroup", value)}
            />

            <CustomSelect
              label="District"
              icon={<MapPin size={18} />}
              value={form.district}
              placeholder="Select district"
              options={Object.keys(districts)}
              open={openDropdown === "district"}
              onToggle={() =>
                setOpenDropdown(openDropdown === "district" ? null : "district")
              }
              onSelect={(value) => updateField("district", value)}
            />

            <CustomSelect
              label="Upazila"
              icon={<MapPin size={18} />}
              value={form.upazila}
              placeholder="Select upazila"
              options={form.district ? districts[form.district] : []}
              open={openDropdown === "upazila"}
              disabled={!form.district}
              onToggle={() =>
                setOpenDropdown(openDropdown === "upazila" ? null : "upazila")
              }
              onSelect={(value) => updateField("upazila", value)}
            />

            <button
              type="submit"
              disabled={!form.bloodGroup || !form.district || !form.upazila}
              className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-red-700 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              <Search size={20} />
              Search Donors
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-12 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-200 border-t-red-700"></div>
          </div>
        )}

        {!loading && searched && donors.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-bold text-gray-900">No donor found</h2>
            <p className="mt-2 text-gray-600">
              Try another blood group or location.
            </p>
          </div>
        )}

        {!loading && donors.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">
              Search Results{" "}
              <span className="rounded-full bg-red-700 px-3 py-1 text-sm text-white">
                {donors.length}
              </span>
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donors.map((donor) => (
                <div
                  key={donor._id}
                  className="rounded-3xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={donor.avatar}
                      alt={donor.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {donor.name}
                      </h3>
                      <p className="break-all text-gray-600">{donor.email}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                      {donor.bloodGroup}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                      {donor.district}, {donor.upazila}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function CustomSelect({
  label,
  icon,
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="relative">
      <label className="mb-2 block font-semibold text-gray-800">{label}</label>

      <button
        type="button"
        disabled={disabled}
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-2xl border bg-white px-4 py-4 text-left transition hover:border-red-400 disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <span className="flex items-center gap-3">
          <span className="text-red-700">{icon}</span>
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || placeholder}
          </span>
        </span>

        <ChevronDown
          size={18}
          className={`transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[105%] z-30 mt-2 max-h-56 overflow-y-auto rounded-2xl border bg-white p-2 shadow-xl">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400">No option</p>
          ) : (
            options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSelect(option)}
                className="block w-full rounded-xl px-3 py-2 text-left text-gray-700 transition hover:bg-red-50 hover:text-red-700"
              >
                {option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}