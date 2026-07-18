import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RainyBudgetPractice from "@/features/shopping/ui/RainyBudgetPractice";

export default async function ShoppingPracticeCompatibilityPage({ params }: { params: Promise<{ missionSlug: string }> }) {
  const { missionSlug } = await params;
  if (missionSlug === "rainy-season-budget-30000") return <><Header /><RainyBudgetPractice /><Footer /></>;
  if (missionSlug === "first-usb-c-cable") redirect("/shopping/missions/first-usb-c-cable/practice");
  notFound();
}
