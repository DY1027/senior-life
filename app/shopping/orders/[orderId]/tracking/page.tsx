import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderTracking from "@/features/shopping/ui/OrderTracking";

export const metadata: Metadata = { title: "배송조회 연습", robots: { index: false, follow: false } };
export default async function TrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderTracking orderId={orderId} /><Footer /></>;
}
