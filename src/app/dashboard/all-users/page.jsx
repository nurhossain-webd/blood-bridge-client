import RoleGuard from "@/components/auth/RoleGuard";
import AllUsersPageClient from "@/components/dashboard/AllUsersPageClient";

export default function AllUsersPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <AllUsersPageClient />
    </RoleGuard>
  );
}