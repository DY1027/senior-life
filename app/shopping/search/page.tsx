import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { searchCommerceProducts } from "@/features/shopping/data/products";
import SearchResults from "@/features/shopping/ui/SearchResults";

export const metadata: Metadata = { title: "연습 상품 검색", robots: { index: false, follow: false } };

export default async function ShoppingSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <><Header /><SearchResults query={q} products={searchCommerceProducts(q)} /><Footer /></>;
}
