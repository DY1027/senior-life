"use client";

import Link from "next/link";
import { useShoppingCart } from "@/features/shopping/storage/use-shopping-storage";

export default function ShoppingCartLink() {
  const cart = useShoppingCart();
  const count = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  return (
    <Link href="/shopping/cart" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-[#C9D8F1] bg-white px-4 text-[16px] font-extrabold text-[#1558C0] no-underline">
      연습 장바구니 <span data-testid="cart-count" className="grid min-h-7 min-w-7 place-items-center rounded-full bg-[#246BDF] px-2 text-white">{count}</span>
    </Link>
  );
}
