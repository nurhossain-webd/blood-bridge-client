import EditDonationRequestForm from "@/components/dashboard/EditDonationRequestForm";

export default async function EditDonationRequestPage({ params }) {
  const { id } = await params;

  return <EditDonationRequestForm id={id} />;
}