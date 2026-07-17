import Link from "next/link";
import { illustrations } from "@/components/dundun-design/illustration-assets";
import { SceneSection } from "@/components/dundun-design/SceneSection";

export function SafetyScene() {
  return (
    <SceneSection
      eyebrow="생활안전"
      title={<>든든이와 확인하는<br />생활안전</>}
      description={<>수상한 문자와 전화는<br />누르기 전에 한 번 더 확인해요.</>}
      image={illustrations.safetyHero}
      imageAlt="든든이가 안전 확인 안내판을 들고 시니어 이용자와 스마트폰 문자를 살펴보는 그림"
      href="/stories"
      actionLabel="생활안전 전체 보기"
      reverse
      tone="blue"
    >
      <ul className="dd-safety-list">
        <li><Link href="/stories/phishing"><strong>보이스피싱, 이렇게 막아요</strong><span>2분 생활안전</span></Link></li>
        <li><span><strong>스마트폰 안전하게 쓰는 법</strong><em>준비 중</em></span></li>
        <li><span><strong>키오스크가 낯설 때 확인할 것</strong><em>준비 중</em></span></li>
      </ul>
    </SceneSection>
  );
}
