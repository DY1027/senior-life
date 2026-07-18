import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderDetail from "@/features/shopping/ui/OrderDetail";

export const metadata: Metadata = { title: "가상 주문 상세", robots: { index: false, follow: false } };
export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderDetail orderId={orderId} /><Footer /></>;
}
