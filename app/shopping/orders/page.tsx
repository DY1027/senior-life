import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderList from "@/features/shopping/ui/OrderList";

export const metadata: Metadata = { title: "가상 주문내역", robots: { index: false, follow: false } };
export default function ShoppingOrdersPage() { return <><Header /><OrderList /><Footer /></>; }
