import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderActionForm from "@/features/shopping/ui/OrderActionForm";

export const metadata: Metadata = { title: "주문 취소 연습", robots: { index: false, follow: false } };
export default async function CancelPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderActionForm orderId={orderId} kind="cancel" /><Footer /></>;
}
