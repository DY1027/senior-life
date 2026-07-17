import Image from "next/image";
import Link from "next/link";

export default function ShoppingPracticeBanner() {
  return (
    <section className="dd-section" aria-labelledby="shopping-practice-home-title">
      <div className="dd-shell">
        <div className="grid overflow-hidden rounded-[28px] border border-[#D8E5FF] bg-[#F2F7FF] shadow-[0_16px_40px_rgba(56,96,180,0.10)] md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-9">
            <span className="mb-3 w-fit rounded-full bg-[#DDE9FF] px-3 py-1 text-[14px] font-extrabold text-[#1558C0]">새로운 무료 연습</span>
            <h2 id="shopping-practice-home-title" className="break-keep text-[29px] font-extrabold leading-tight text-[#25324A] sm:text-[38px]">검색부터 주문 확인까지<br />쇼핑을 천천히 연습해요</h2>
            <p className="mt-4 break-keep text-[17px] leading-relaxed text-[#5B6575]">실제 결제 없이 상품 비교, 예산 맞추기와 주문 실수 찾기를 해볼 수 있어요.</p>
            <Link href="/shopping" className="mt-6 inline-flex min-h-14 w-fit items-center justify-center rounded-2xl bg-[#246BDF] px-7 text-[18px] font-extrabold text-white no-underline">쇼핑 연습관 들어가기 →</Link>
          </div>
          <div className="relative min-h-[260px] bg-white md:min-h-[360px]">
            <Image src="/images/shopping/hero/shopping-practice-hero.jpg" alt="비 오는 날 현관에 우산과 미끄럼방지용품을 준비한 모습" fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
