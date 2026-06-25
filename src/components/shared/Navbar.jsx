"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Droplet, Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || "/avatar.png";

  const handleLogout = async () => {
    try {
      localStorage.removeItem("access_token");
      await authClient.signOut();

      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const navLinkClass = (href) =>
    pathname === href
      ? "font-semibold text-red-700"
      : "text-gray-700 transition hover:text-red-700";

  return (
    <nav className="fixed left-0 top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold text-red-700"
        >
          <Droplet />
          BloodBridge
        </Link>

        <div className="hidden items-center gap-8 font-medium md:flex">
          {!session?.user ? (
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>

              <Link
                href="/donation-requests"
                className={navLinkClass("/donation-requests")}
              >
                Donation Requests
              </Link>

              <Link href="/search" className={navLinkClass("/search")}>
                Search Donors
              </Link>

              <Link
                href="/login"
                className="rounded-xl bg-red-700 px-5 py-2 text-white transition hover:bg-red-800"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className={navLinkClass("/")}>
                Home
              </Link>

              <Link
                href="/donation-requests"
                className={navLinkClass("/donation-requests")}
              >
                Donation Requests
              </Link>

              <Link href="/search" className={navLinkClass("/search")}>
                Search Donors
              </Link>

              <Link href="/funding" className={navLinkClass("/funding")}>
                Funding
              </Link>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-full bg-red-50 px-2 py-1 transition hover:bg-red-100"
                >
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <span className="hidden font-semibold text-gray-800 lg:block">
                    {userName}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`text-gray-700 transition ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-48 rounded-2xl border bg-white p-2 shadow-xl">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block rounded-xl px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-700"
                    >
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-4 py-2 text-left text-gray-700 hover:bg-red-50 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4 font-medium">
            {!session?.user ? (
              <>
                <Link href="/" className={navLinkClass("/")}>
                  Home
                </Link>

                <Link
                  href="/donation-requests"
                  className={navLinkClass("/donation-requests")}
                >
                  Donation Requests
                </Link>

                <Link href="/search" className={navLinkClass("/search")}>
                  Search Donors
                </Link>

                <Link
                  href="/login"
                  className="rounded-xl bg-red-700 px-4 py-2 text-center text-white"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link href="/" className={navLinkClass("/")}>
                  Home
                </Link>

                <Link
                  href="/donation-requests"
                  className={navLinkClass("/donation-requests")}
                >
                  Donation Requests
                </Link>

                <Link href="/search" className={navLinkClass("/search")}>
                  Search Donors
                </Link>

                <Link href="/funding" className={navLinkClass("/funding")}>
                  Funding
                </Link>

                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3">
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <span className="font-semibold text-gray-800">
                    {userName}
                  </span>
                </div>

                <Link href="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>

                <button onClick={handleLogout} className="text-left text-gray-700">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}