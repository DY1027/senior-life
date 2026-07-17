// 키오스크 임무 허브 공용 화면 — 카탈로그·시나리오만 주입하면 된다 (서버 컴포넌트).
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { kioskIllustrations } from "@/components/dundun-design/illustration-assets";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";
import MissionList from "@/components/kiosk-engine/MissionList";
import KioskSafetyNotice from "@/components/kiosk-engine/KioskSafetyNotice";
import { getKioskConfig } from "@/lib/kiosk-config";
import type { Catalog, Scenario } from "@/lib/kiosk-engine/types";

export default function KioskHub({
  catalog,
  scenarios,
}: {
  catalog: Catalog;
  scenarios: Scenario[];
}) {
  const config = getKioskConfig(catalog.kioskType);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[880px] px-5 pb-14 pt-8">
        <div className="dd-kiosk-hub-hero">
          <SectionHeading
            level={1}
            eyebrow={config.name}
            title={config.accentLabel}
            description={config.shortDescription}
          />
          <div className="dd-kiosk-hub-image">
            <Image
              src={kioskIllustrations[config.id]}
              alt={`${config.name}에서 든든이와 함께 ${config.accentLabel}을 하는 그림`}
              fill
              priority
              sizes="(max-width: 767px) 100vw, 42vw"
              className="object-contain"
            />
          </div>
        </div>
        <KioskSafetyNotice
          message={config.safetyMessage}
          additionalMessage={config.additionalSafetyMessage}
          className="mb-7"
        />
        <MissionList kioskType={catalog.kioskType} scenarios={scenarios} />
      </main>
      <Footer />
    </>
  );
}
