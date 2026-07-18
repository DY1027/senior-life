"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";
import ShoppingCartLink from "@/features/shopping/ui/ShoppingCartLink";
import { saveShoppingProgress, setActiveBudget } from "@/features/shopping/storage/shopping-storage";

export default function ShoppingSearchPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => setActiveBudget(undefined), []);

  return (
    <section data-testid="shopping-hub" aria-labelledby="shopping-common-title" className="mb-16 rounded-[28px] border border-[#D9E4F5] bg-white p-5 shadow-[0_12px_32px_rgba(48,79,128,0.07)] sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[14px] font-extrabold text-[#246BDF]">공용 쇼핑 연습</span>
          <h2 id="shopping-common-title" className="mt-2 text-[28px] font-black leading-tight text-[#25324A] sm:text-[36px]">검색해서 가상 주문까지 해보세요</h2>
        </div>
        <ShoppingCartLink />
      </div>
      <div className="mt-5"><PracticeDisclosure /></div>
      <form
        className="mt-5 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const trimmed = query.trim();
          if (trimmed) {
            saveShoppingProgress("search", { query: trimmed });
            router.push(`/shopping/search?q=${encodeURIComponent(trimmed)}`);
          }
        }}
      >
        <label htmlFor="shopping-search" className="sr-only">상품 검색어</label>
        <input
          id="shopping-search"
          data-testid="shopping-search-input"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: C타입 충전 케이블"
          className="min-h-14 min-w-0 flex-1 rounded-2xl border-2 border-[#BFD0E9] bg-white px-4 text-[18px] text-[#25324A] outline-none focus:border-[#246BDF]"
        />
        <button data-testid="shopping-search-submit" type="submit" className="min-h-14 rounded-2xl bg-[#246BDF] px-7 text-[18px] font-extrabold text-white">검색</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="추천 검색어">
        {["C타입 충전 케이블", "장마철 준비물"].map((keyword) => (
          <button key={keyword} type="button" onClick={() => setQuery(keyword)} className="min-h-11 rounded-full bg-[#EDF4FF] px-4 text-[15px] font-bold text-[#1558C0]">{keyword}</button>
        ))}
      </div>
    </section>
  );
}
