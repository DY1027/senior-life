import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { OrderState } from "@/features/shopping/domain/types";
import OrderFixture from "@/features/shopping/ui/OrderFixture";

type FixtureState = Extract<OrderState, "PAID" | "SHIPPED" | "DELIVERED">;
const FIXTURE_STATES: Record<string, FixtureState> = { paid: "PAID", shipped: "SHIPPED", delivered: "DELIVERED" };

export const metadata: Metadata = { title: "주문 이후 기능 테스트", robots: { index: false, follow: false } };
export default async function OrderFixturePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const fixtureState = FIXTURE_STATES[state];
  if (!fixtureState) notFound();
  return <><Header /><OrderFixture state={fixtureState} /><Footer /></>;
}
