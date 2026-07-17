import Image from "next/image";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { getPractice, NEW_PRACTICE_ID, UPCOMING_PRACTICE } from "@/lib/practices";

export default function NewPracticeBanner() {
  const fresh = getPractice(NEW_PRACTICE_ID);
  if (!fresh) return null;

  return (
    <section className="dd-section" aria-labelledby="new-practice-title">
      <div className="dd-shell dd-new-practice">
        <div className="dd-new-practice-image">
          <Image
            src={illustrations.newPractice}
            alt="든든이가 새로 공개된 생활기기 연습을 시니어 이용자에게 소개하는 그림"
            fill
            sizes="(max-width: 767px) 100vw, 48vw"
            className="object-cover"
          />
        </div>
        <div className="dd-new-practice-copy">
          <p className="dd-eyebrow">새로 열렸어요</p>
          <h2 id="new-practice-title">{fresh.worldName}</h2>
          <p><strong>{fresh.title}</strong>이 새로 열렸어요. {fresh.desc}</p>
          <PrimaryAction href={fresh.href}>새 연습 시작</PrimaryAction>
          <div className="dd-upcoming" aria-label="준비 중인 다음 연습">
            <span>다음 연습</span>
            <strong>{UPCOMING_PRACTICE.title}</strong>
            <em>준비 중</em>
          </div>
        </div>
      </div>
    </section>
  );
}
