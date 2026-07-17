"use client";

import Image from "next/image";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { SceneCard } from "@/components/dundun-design/SceneCard";
import { SectionHeading } from "@/components/dundun-design/SectionHeading";
import { PRACTICES } from "@/lib/practices";
import { useProgress } from "@/lib/progress";

export default function PracticeGrid() {
  const progress = useProgress();

  return (
    <section className="dd-section dd-section-warm" aria-labelledby="practice-village-title">
      <div className="dd-shell">
        <SectionHeading
          id="practice-village-title"
          eyebrow="디지털 생활 연습마을"
          title={<>든든이와 둘러보는<br />디지털 생활 연습마을</>}
          description={<>연습하고 싶은 장소를 골라보세요.<br />모든 화면은 실제 결제가 없는 연습용이에요.</>}
        />

        <div className="dd-village-map">
          <Image
            src={illustrations.practiceVillage}
            alt="든든카페, 든든버거, 든든역, 든든주차장, 든든마트, 든든은행, 든든민원실의 위치를 보여주는 디지털 생활 연습마을 그림"
            fill
            sizes="(max-width: 767px) 100vw, 1180px"
            className="object-contain"
          />
        </div>

        <div className="dd-practice-grid">
          {PRACTICES.map((practice) => {
            const doneCount = progress?.counts[practice.id] ?? 0;
            return (
              <SceneCard
                key={practice.id}
                href={practice.href}
                image={practice.img ?? "/mascot.webp"}
                imageAlt={`${practice.worldName}에서 ${practice.title}을 연습하는 장면`}
                tag={practice.category}
                title={practice.worldName}
                subtitle={practice.title}
                description={practice.desc}
                actionLabel="연습 시작"
                status={doneCount > 0 ? `도장 ${Math.min(doneCount, 99)}개 · 완료 경험 있음` : "처음이어도 바로 시작할 수 있어요"}
              />
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <PrimaryAction href="/kiosk" variant="secondary">연습 전체 보기</PrimaryAction>
        </div>
      </div>
    </section>
  );
}
