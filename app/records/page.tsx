import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecordsBoard from "@/components/records/RecordsBoard";

export const metadata: Metadata = {
  title: "나의 연습 기록",
  description: "현재 기기에 저장된 키오스크 연습 완료 기록과 도장을 확인하세요.",
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
