import RegisterForm from "@/components/auth/RegisterForm";
export const metadata = {
  title: "Register | BloodBridge",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <RegisterForm />
    </main>
  );
}