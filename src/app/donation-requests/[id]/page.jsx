import DonationRequestDetails from "@/components/donation/DonationRequestDetails";

export default async function DonationRequestDetailsPage({ params }) {
  const { id } = await params;

  return <DonationRequestDetails id={id} />;
}