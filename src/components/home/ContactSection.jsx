export default function ContactSection() {
  return (
    <section className="bg-red-50 px-5 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>
          <p className="mt-3 text-gray-600">
            Need support or want to collaborate with BloodBridge? Send us a message.
          </p>
          <p className="mt-6 font-semibold text-red-700">
            Emergency Support: +880 1234 567890
          </p>
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
  );
}