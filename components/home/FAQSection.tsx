"use client";
import { useState } from "react";
import { safeJsonLd } from "@/lib/jsonld";
import { DungDungGuide } from "@/components/dundun-design/DungDungGuide";
import { illustrations } from "@/components/dundun-design/illustration-assets";

const faqs = [
  { q: "정말 실제로 결제되거나 접수되나요?", a: "아닙니다. 모든 화면은 연습용 모의 화면이며 실제 주문, 결제, 발급, 송금이 전혀 이루어지지 않습니다. 몇 번을 잘못 눌러도 아무 일도 생기지 않으니 마음 편하게 연습하세요." },
  { q: "회원가입이나 로그인이 필요한가요?", a: "아니요. 시니어 든든은 회원가입 기능 자체가 없습니다. 모든 연습과 놀이를 로그인 없이 무료로 사용할 수 있습니다." },
  { q: "연습 기록과 도장은 어디에 저장되나요?", a: "지금 사용 중인 휴대전화나 태블릿의 브라우저에만 저장됩니다. 서버로 전송되지 않으며, 브라우저의 인터넷 기록을 지우면 함께 지워집니다. 다른 기기에서는 기록이 보이지 않아요." },
  { q: "실제 기계와 화면이 똑같나요?", a: "실제 사용 흐름과 상황을 비슷하게 재현했지만, 실제 기기의 화면 구성과 순서는 매장과 기기마다 다를 수 있습니다. 버튼 위치를 외우기보다 '화면에서 필요한 버튼을 찾는 연습'으로 활용하세요." },
  { q: "가족이나 다른 사람과 함께 사용해도 되나요?", a: "네. 혼자 사용해도 되고, 도움이 필요한 경우 가족이나 지인과 함께 연습해도 됩니다. 다만 실제 화면을 직접 눌러보는 것이 가장 좋은 연습이 됩니다." },
  { q: "광고가 있나요?", a: "일부 완료 화면과 콘텐츠 하단에 쿠팡 파트너스 제휴 링크가 포함될 수 있으며, 광고 영역에는 항상 광고임을 표시합니다. 광고를 누르지 않아도 모든 기능을 그대로 사용할 수 있습니다." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="dd-faq-section" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <div className="dd-faq-shell">
        <aside className="dd-faq-trust" aria-label="안심하고 이용하세요">
          <DungDungGuide
            image={illustrations.mistakeGuide}
            alt="든든이가 실수한 이용자에게 이전 버튼과 다시 시작을 안내하는 그림"
          >
            처음이어도 괜찮아요.<br />마음껏 눌러보고 다시 연습할 수 있어요.
          </DungDungGuide>
          <ul className="dd-faq-trust-list">
            <li>✓ 실제 주문·결제·송금·발급 없음</li>
            <li>✓ 회원가입 없이 사용</li>
            <li>✓ 기록은 현재 기기에 저장</li>
          </ul>
        </aside>
        <p className="dd-eyebrow">FAQ</p>
        <h2 id="faq-title" className="dd-faq-title">자주 묻는 질문</h2>
        <div className="dd-faq-list">
          {faqs.map((f, i) => (
            <div key={f.q} className={`dd-faq-item${open === i ? " is-open" : ""}`}>
              <button
                type="button"
                className="dd-faq-button"
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="dd-faq-question">
                  <span className="dd-faq-mark">Q.</span>
                  <span>{f.q}</span>
                </span>
                <svg className="dd-faq-chevron" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && (
                <div id={`faq-answer-${i}`} className="dd-faq-answer-wrap">
                  <div className="dd-faq-answer">
                    <span className="dd-faq-mark">A.</span>
                    <span>{f.a}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
