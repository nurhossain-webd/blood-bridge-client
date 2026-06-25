import Link from "next/link";
import { Droplet, HeartHandshake, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Logo */}
        <div>
          <div className="flex items-center gap-2">
            <Droplet className="text-red-500" size={30} />
            <h2 className="text-2xl font-bold text-white">
              BloodBridge
            </h2>
          </div>

          <p className="mt-4 leading-7">
            Connecting blood donors with patients in need through a secure,
            reliable, and easy-to-use blood donation platform.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">
            <Link href="/" className="hover:text-red-400">
              Home
            </Link>

            <Link
              href="/donation-requests"
              className="hover:text-red-400"
            >
              Donation Requests
            </Link>

            <Link href="/search" className="hover:text-red-400">
              Search Donors
            </Link>

            <Link href="/funding" className="hover:text-red-400">
              Funding
            </Link>
          </div>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Account
          </h3>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="hover:text-red-400">
              Login
            </Link>

            <Link href="/register" className="hover:text-red-400">
              Register
            </Link>

            <Link href="/dashboard" className="hover:text-red-400">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Contact
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-red-500" />
              <span>support@bloodbridge.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-red-500" />
              <span>+880 1234-567890</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-red-500" />
              <span>Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-6 text-sm md:flex-row">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-white">
              BloodBridge
            </span>
            . All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 text-red-400">
            <HeartHandshake size={18} />
            <span>Donate Blood • Save Lives</span>
          </div>
        </div>
      </div>
    </footer>
  );
}