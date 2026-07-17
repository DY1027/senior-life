import Image from "next/image";
import { DungDungGuide } from "@/components/dundun-design/DungDungGuide";
import { kioskIllustrations } from "@/components/dundun-design/illustration-assets";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { dailyMissionUrl, todayMission } from "@/lib/daily-missions";
import { getKioskConfig } from "@/lib/kiosk-config";

function modeLabel(scenarioId: string) {
  if (scenarioId.includes("-challenge-")) return "실제처럼 도전";
  if (scenarioId.includes("-solo-")) return "혼자 연습하기";
  return "천천히 배우기";
}

export default function TodayMission() {
  const mission = todayMission();
  const config = getKioskConfig(mission.kioskType);

  return (
    <section className="dd-section" aria-labelledby="today-mission-title">
      <div className="dd-shell">
        <article className="dd-mission-panel">
          <div className="dd-mission-copy">
            <p className="dd-eyebrow">오늘의 연습</p>
            <h2 id="today-mission-title" className="dd-mission-title">{mission.title}</h2>
            <p className="dd-mission-description">{mission.description}</p>
            <dl className="dd-mission-meta">
              <div><dt>예상 시간</dt><dd>약 3분</dd></div>
              <div><dt>연습 방식</dt><dd>{modeLabel(mission.scenarioId)}</dd></div>
              <div><dt>연습 장소</dt><dd>{config.name}</dd></div>
            </dl>
            <p className="dd-safe-note"><span aria-hidden="true">✓</span> 실제 결제·송금·발급은 이루어지지 않아요.</p>
            <PrimaryAction href={dailyMissionUrl(mission)}>오늘 임무 바로 시작</PrimaryAction>
          </div>
          <div className="dd-mission-visual">
            <Image
              src={kioskIllustrations[mission.kioskType]}
              alt={`${config.name}에서 든든이와 함께 ${config.accentLabel}을 하는 그림`}
              fill
              sizes="(max-width: 767px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
          <div className="dd-mission-guide">
            <DungDungGuide compact image="/mascot.webp" alt="든든이가 오늘의 연습 방법을 알려주는 그림">
              실수해도 괜찮아요.<br />이전 버튼으로 다시 골라보세요.
            </DungDungGuide>
          </div>
        </article>
      </div>
    </section>
  );
}
