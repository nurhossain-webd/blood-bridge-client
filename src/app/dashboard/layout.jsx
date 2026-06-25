import Navbar from "@/components/shared/Navbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen flex-col pt-20 lg:flex-row">
        <DashboardSidebar />

        <main className="flex-1 bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </>
  );
}