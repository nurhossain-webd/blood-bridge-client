import LoginForm from "@/components/auth/LoginForm";
export const metadata = {
  title: "Login | BloodBridge",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 px-4 py-10">
      <LoginForm />
    </main>
  );
}