import "./globals.css";
import ToastProvider from "@/components/providers/ToastProvider";

export const metadata = {
  title: "BloodBridge",
  description: "Blood Donation Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider />
        {children}
      </body>
    </html>
  );
}