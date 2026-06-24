"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Droplet, Menu, X } from "lucide-react";
import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await axiosPublic.post("/logout");
await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  const links = (
    <>
      <Link href="/donation-requests" className="hover:text-red-700">
        Donation Requests
      </Link>
      <Link href="/search" className="hover:text-red-700">
        Search Donors
      </Link>
    </>
  );

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-red-700">
          <Droplet />
          BloodBridge
        </Link>

        <div className="hidden items-center gap-7 font-medium text-gray-700 md:flex">
          {links}

          {session?.user ? (
            <>
              <Link href="/dashboard" className="rounded-xl bg-red-700 px-5 py-2 text-white">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="rounded-xl border px-5 py-2">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-xl bg-red-700 px-5 py-2 text-white">
              Login
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4 font-medium text-gray-700">
            {links}
            {session?.user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="text-left">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}