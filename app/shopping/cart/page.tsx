import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShoppingCart from "@/features/shopping/ui/ShoppingCart";

export const metadata: Metadata = { title: "연습 장바구니", robots: { index: false, follow: false } };
export default function ShoppingCartPage() { return <><Header /><ShoppingCart /><Footer /></>; }
