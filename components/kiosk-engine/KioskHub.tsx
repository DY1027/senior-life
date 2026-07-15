// 키오스크 임무 허브 공용 화면 — 카탈로그·시나리오만 주입하면 된다 (서버 컴포넌트).
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MissionList from "@/components/kiosk-engine/MissionList";
import type { Catalog, Scenario } from "@/lib/kiosk-engine/types";

export default function KioskHub({
  catalog,
  scenarios,
  heading,
  intro,
}: {
  catalog: Catalog;
  scenarios: Scenario[];
  heading: string;
  intro: string;
}) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-5 pb-14 pt-8">
        <div className="mb-7 text-center">
          <p className="text-[44px]" aria-hidden="true">{catalog.emoji}</p>
          <h1 className="mt-1 text-[clamp(24px,5vw,32px)] font-extrabold leading-tight tracking-[-0.5px] text-[#3B3226]">
            {heading}
          </h1>
          <p className="mt-2 whitespace-pre-line text-[16px] leading-relaxed text-[#4A5568]">{intro}</p>
        </div>
        <MissionList kioskType={catalog.kioskType} scenarios={scenarios} />
      </main>
      <Footer />
    </>
  );
}
