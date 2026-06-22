import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <main className="min-h-screen bg-gray-50 lg:flex">
      <DashboardSidebar />

      <section className="flex-1 p-4 lg:p-8">
        {children}
      </section>
    </main>
  );
}