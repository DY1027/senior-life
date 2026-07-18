import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderActionForm from "@/features/shopping/ui/OrderActionForm";

export const metadata: Metadata = { title: "반품 신청 연습", robots: { index: false, follow: false } };
export default async function ReturnPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderActionForm orderId={orderId} kind="return" /><Footer /></>;
}
