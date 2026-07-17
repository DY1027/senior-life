"use client";

import Image from "next/image";
import Link from "next/link";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { PrimaryAction } from "@/components/dundun-design/PrimaryAction";
import { weeklyChallenge } from "@/lib/practices";
import { completedThisWeek, useProgress } from "@/lib/progress";

export default function WeeklyChallenge() {
  const progress = useProgress();
  const challenges = weeklyChallenge();
  const done = challenges.map((practice) => progress ? completedThisWeek(progress, practice.id) : false);
  const doneCount = done.filter(Boolean).length;
  const allDone = doneCount === challenges.length;
  const nextChallenge = challenges.find((_, index) => !done[index]) ?? challenges[0];

  return (
    <section className="dd-section dd-section-green" aria-labelledby="weekly-challenge-title">
      <div className="dd-shell dd-challenge-panel">
        <div className="dd-challenge-visual">
          <Image
            src={illustrations.weeklyChallenge}
            alt="든든이와 시니어 이용자가 세 가지 주간 도전을 도장판으로 확인하는 그림"
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="dd-challenge-copy">
          <p className="dd-eyebrow">꾸준히 모으는 도장</p>
          <div className="dd-challenge-title-row">
            <h2 id="weekly-challenge-title">이번 주 도전</h2>
            <strong>{doneCount} / {challenges.length} 완료</strong>
          </div>
          <div className="dd-progress-track" aria-label={`이번 주 도전 ${challenges.length}개 중 ${doneCount}개 완료`}>
            <span style={{ width: `${(doneCount / challenges.length) * 100}%` }} />
          </div>
          <ul className="dd-challenge-list">
            {challenges.map((practice, index) => (
              <li key={practice.id}>
                <span className="dd-challenge-state" aria-hidden="true">{done[index] ? "✓" : index + 1}</span>
                <span>
                  <strong>{practice.title}</strong>
                  <small>{done[index] ? "완료" : "아직 연습할 수 있어요"}</small>
                </span>
                <Link href={practice.href}>{done[index] ? "다시 하기" : "연습하기"}</Link>
              </li>
            ))}
          </ul>
          <p className="dd-challenge-note">세 가지를 모두 완료하면 이번 주 도장을 받을 수 있어요.</p>
          <PrimaryAction href={allDone ? "/records" : nextChallenge.href}>
            {allDone ? "받은 도장 확인" : "다음 도전 시작"}
          </PrimaryAction>
        </div>
      </div>
    </section>
  );
}
