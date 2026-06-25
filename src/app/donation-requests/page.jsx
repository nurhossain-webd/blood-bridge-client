import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import PublicDonationRequests from "@/components/donation/PublicDonationRequests";

export const metadata = {
  title: "Donation Requests | BloodBridge",
};

export default function DonationRequestsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PublicDonationRequests />
      </main>
      <Footer />
    </>
  );
}