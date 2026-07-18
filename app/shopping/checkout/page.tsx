import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Checkout from "@/features/shopping/ui/Checkout";

export const metadata: Metadata = { title: "가상 주문 확인", robots: { index: false, follow: false } };
export default function ShoppingCheckoutPage() { return <><Header /><Checkout /><Footer /></>; }
