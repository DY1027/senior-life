import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderComplete from "@/features/shopping/ui/OrderComplete";

export const metadata: Metadata = { title: "연습 주문 완료", robots: { index: false, follow: false } };
export default async function ShoppingOrderCompletePage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <><Header /><OrderComplete orderId={orderId} /><Footer /></>;
}
