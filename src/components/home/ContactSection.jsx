import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-gradient-to-br from-red-50 via-white to-rose-50 px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
            Contact BloodBridge
          </span>

          <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
            Need support or want to collaborate?
          </h2>

          <p className="mt-4 max-w-xl leading-7 text-gray-600">
            Our team is here to help donors, volunteers, and organizations
            connect quickly during urgent blood donation situations.
          </p>

          <div className="mt-8 space-y-4">
            <ContactInfo
              icon={Phone}
              title="Emergency Support"
              value="+880 1234 567890"
            />

            <ContactInfo
              icon={Mail}
              title="Email Support"
              value="support@bloodbridge.com"
            />

            <ContactInfo
              icon={MapPin}
              title="Location"
              value="Dhaka, Bangladesh"
            />
          </div>
        </div>

        <form className="rounded-3xl border border-red-100 bg-white p-6 shadow-xl md:p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Send a Message
            </h3>
            <p className="mt-2 text-gray-600">
              Fill out the form and we will get back to you soon.
            </p>
          </div>

          <input
            className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500"
            placeholder="Your name"
          />

          <input
            type="email"
            className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500"
            placeholder="Your email"
          />

          <textarea
            className="mb-4 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none focus:border-red-500"
            rows="5"
            placeholder="Write your message..."
          ></textarea>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white transition hover:bg-red-800"
          >
            <Send size={18} />
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

function ContactInfo({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-700">
        <Icon size={22} />
      </div>

      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}