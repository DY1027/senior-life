import { CurvedSectionDivider } from "@/components/dundun-design/CurvedSectionDivider";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { MascotHero } from "@/components/dundun-design/MascotHero";
import { dailyMissionUrl, todayMission } from "@/lib/daily-missions";

export default function PlaygroundHero() {
  const mission = todayMission();

  return (
    <>
      <MascotHero
        eyebrow="시니어 디지털 놀이터"
        title={<>든든이와 함께<br />실제처럼 눌러봐요</>}
        description={<>카페 주문부터 ATM까지.<br />실제 결제 없이 천천히 연습할 수 있어요.</>}
        image={illustrations.homeHero}
        imageAlt="든든이가 시니어 이용자와 함께 카페, 기차역, 주차장, 마트의 디지털 기기 연습 공간을 안내하는 그림"
        primaryHref={dailyMissionUrl(mission)}
        primaryLabel="오늘의 연습 시작"
        secondaryHref="/kiosk"
        secondaryLabel="연습마을 둘러보기"
      />
      <CurvedSectionDivider />
    </>
  );
}
