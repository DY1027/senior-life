import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { dailyMissionUrl, todayMission } from "@/lib/daily-missions";

export const metadata: Metadata = {
  title: "서비스 변경 안내",
  description: "시니어든든의 현재 디지털 생활기기 연습 서비스를 안내합니다.",
  alternates: { canonical: "/service-changed" },
  robots: { index: false, follow: false },
};

export const revalidate = 86400;

export default function ServiceChangedPage() {
  const missionUrl = dailyMissionUrl(todayMission());

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-[720px] flex-1 items-center px-5 py-12">
        <section className="w-full rounded-[28px] border-2 border-[#EFDFC0] bg-[#FFFDF8] px-6 py-10 text-center sm:px-10">
          <span className="inline-flex rounded-full bg-[#FDF0E0] px-4 py-2 text-[15px] font-bold text-[#C4621A]">
            서비스 변경 안내
          </span>
          <h1 className="mt-5 break-keep text-[clamp(26px,6vw,38px)] font-extrabold leading-tight text-[#3B3226]">
            시니어든든의 서비스가 새롭게 바뀌었습니다.
          </h1>
          <p className="mt-5 break-keep text-[17px] leading-8 text-[#4A5568]">
            현재 시니어든든은 생활 속 디지털 기기를 실제처럼 연습할 수 있는 디지털 생활 놀이터로 운영하고 있습니다.
          </p>
          <p className="mt-3 break-keep text-[17px] leading-8 text-[#4A5568]">
            카페 주문, 기차표 예매, 주차 정산, 마트 셀프계산대와 ATM 등을 안전하게 연습해보세요.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/kiosk"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[#C4621A] px-6 text-[17px] font-extrabold text-white no-underline"
            >
              생활기기 연습 둘러보기
            </Link>
            <Link
              href={missionUrl}
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-[#C4621A] bg-white px-6 text-[17px] font-extrabold text-[#C4621A] no-underline"
            >
              오늘의 연습 시작하기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
