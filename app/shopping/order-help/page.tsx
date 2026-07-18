import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AlertIcon, DeliveryIcon, ReturnIcon } from "@/components/shopping/ShoppingIcons";
import PracticeDisclosure from "@/features/shopping/ui/PracticeDisclosure";

export const metadata: Metadata = { title: "주문 문제 해결하기", robots: { index: false, follow: false } };

const PROBLEMS = [
  { title: "배송조회", description: "배송 중인 주문이 지금 어디까지 왔는지 확인해요.", href: "/shopping/test-fixtures/order/shipped", label: "배송 상태 확인", Icon: DeliveryIcon, tone: "blue" },
  { title: "주문 취소", description: "배송이 시작되기 전에 취소하고 환불 금액을 확인해요.", href: "/shopping/test-fixtures/order/paid", label: "취소 연습 시작", Icon: ReturnIcon, tone: "red" },
  { title: "반품", description: "배송 완료 상품의 반품 사유와 배송비를 확인해요.", href: "/shopping/test-fixtures/order/delivered", label: "반품 연습 시작", Icon: ReturnIcon, tone: "green" },
  { title: "교환", description: "재고가 있는 새 옵션을 고르고 교환을 신청해요.", href: "/shopping/test-fixtures/order/delivered", label: "교환 연습 시작", Icon: ReturnIcon, tone: "violet" },
] as const;

const TONES = {
  blue: "bg-[#EAF2FF] text-[#1558C0]",
  red: "bg-[#FFF0EF] text-[#B72D27]",
  green: "bg-[#E9F7EF] text-[#24704C]",
  violet: "bg-[#F2EDFF] text-[#6843BD]",
} as const;

export default function OrderHelpPage() {
  return (
    <>
      <Header />
      <main data-testid="order-help-hub" className="mx-auto w-full max-w-[980px] px-4 py-8 sm:px-6 sm:py-12">
        <Link href="/shopping" className="text-[15px] font-extrabold text-[#246BDF]">쇼핑 연습관 선택으로</Link>
        <span className="mt-5 block text-[14px] font-extrabold text-[#246BDF]">주문 이후 연습</span>
        <h1 className="mt-2 text-[34px] font-black leading-tight text-[#25324A] sm:text-[46px]">어떤 문제를 해결해볼까요?</h1>
        <p className="mt-3 max-w-[700px] break-keep text-[17px] leading-relaxed text-[#667287]">주문 상태에 맞는 버튼만 보입니다. 실제 주문과 개인정보 없이 여러 번 연습할 수 있어요.</p>
        <div className="mt-6"><PracticeDisclosure /></div>

        <section className="mt-7 rounded-3xl border border-[#F0C7BE] bg-[#FFF7F5] p-5 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6" aria-labelledby="mistake-mission-title">
          <div className="flex items-start gap-4">
            <span className="grid h-13 w-13 flex-none place-items-center rounded-2xl bg-[#FFE4DF] text-[#B65035]"><AlertIcon className="h-7 w-7" /></span>
            <div>
              <span className="text-[13px] font-black text-[#B65035]">주문 전 확인 연습</span>
              <h2 id="mistake-mission-title" className="mt-1 text-[24px] font-black text-[#25324A]">주문 화면의 실수 찾기</h2>
              <p className="mt-2 break-keep text-[16px] leading-relaxed text-[#667287]">옵션·수량·정기배송·배송비 오류를 찾고 올바른 값으로 직접 고쳐요.</p>
            </div>
          </div>
          <Link data-testid="start-order-mistake-mission" href="/shopping/missions/find-order-mistake" className="mt-5 inline-flex min-h-12 flex-none items-center justify-center rounded-xl bg-[#B65035] px-5 text-[16px] font-extrabold text-white no-underline sm:mt-0">실수 찾기 시작</Link>
        </section>

        <section className="mt-7 grid gap-4 sm:grid-cols-2" aria-label="주문 이후 연습 선택">
          {PROBLEMS.map(({ title, description, href, label, Icon, tone }) => (
            <Link key={title} href={href} className="rounded-3xl border border-[#DCE6F4] bg-white p-5 text-inherit no-underline shadow-[0_10px_28px_rgba(41,69,115,0.07)] sm:p-6">
              <span className={`grid h-13 w-13 place-items-center rounded-2xl ${TONES[tone]}`}><Icon className="h-7 w-7" /></span>
              <h2 className="mt-5 text-[24px] font-black text-[#25324A]">{title}</h2>
              <p className="mt-2 min-h-[52px] break-keep text-[16px] leading-relaxed text-[#667287]">{description}</p>
              <strong className="mt-5 inline-flex min-h-12 items-center rounded-xl bg-[#246BDF] px-4 text-[15px] font-extrabold text-white">{label}</strong>
            </Link>
          ))}
        </section>
        <Link href="/shopping/orders" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-[#C9D8F1] bg-white px-5 font-extrabold text-[#1558C0] no-underline sm:w-auto">내 가상 주문내역 보기</Link>
      </main>
      <Footer />
    </>
  );
}
