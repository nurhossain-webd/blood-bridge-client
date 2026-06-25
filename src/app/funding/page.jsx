import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import RoleGuard from "@/components/auth/RoleGuard";
import FundingPageClient from "@/components/funding/FundingPageClient";

export const metadata = {
  title: "Funding | BloodBridge",
};

export default function FundingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <RoleGuard allowedRoles={["admin", "donor", "volunteer"]}>
          <FundingPageClient />
        </RoleGuard>
      </main>
      <Footer />
    </>
  );
}