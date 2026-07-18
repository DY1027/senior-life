import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderRefund from "@/features/shopping/ui/OrderRefund";

export const metadata: Metadata = { title: "환불 확인 연습", robots: { index: false, follow: false } };
export default async function RefundPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderRefund orderId={orderId} /><Footer /></>;
}
