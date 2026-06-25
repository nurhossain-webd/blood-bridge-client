import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import SearchDonors from "@/components/search/SearchDonors";

export const metadata = {
  title: "Search Donors | BloodBridge",
};

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <SearchDonors />
      </main>
      <Footer />
    </>
  );
}