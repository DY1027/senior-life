import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecordsBoard from "@/components/records/RecordsBoard";

export const metadata: Metadata = {
  title: "내 기록 — 연습 도장판",
  description: "이 기기 브라우저에 저장된 나의 연습 기록과 도장판을 확인합니다.",
  alternates: { canonical: "/records" },
  // 개인 기록 화면이라 검색에 노출할 이유가 없다
  robots: { index: false, follow: false },
};

export default function RecordsPage() {
  return (
    <>
      <Header />
      <RecordsBoard />
      <Footer />
    </>
  );
}
