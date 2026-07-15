"use client";
import { useState } from "react";

const faqs = [
  { q: "정말 실제로 결제되거나 접수되나요?", a: "아닙니다. 모든 화면은 연습용 모의 화면이며 실제 주문, 결제, 발급, 송금이 전혀 이루어지지 않습니다. 몇 번을 잘못 눌러도 아무 일도 생기지 않으니 마음 편하게 연습하세요." },
  { q: "회원가입이나 로그인이 필요한가요?", a: "아니요. 시니어 든든은 회원가입 기능 자체가 없습니다. 모든 연습과 놀이를 로그인 없이 무료로 사용할 수 있습니다." },
  { q: "연습 기록과 도장은 어디에 저장되나요?", a: "지금 사용 중인 휴대전화나 태블릿의 브라우저에만 저장됩니다. 서버로 전송되지 않으며, 브라우저의 인터넷 기록을 지우면 함께 지워집니다. 다른 기기에서는 기록이 보이지 않아요." },
  { q: "실제 기계와 화면이 똑같나요?", a: "실제 사용 흐름과 상황을 비슷하게 재현했지만, 실제 기기의 화면 구성과 순서는 매장과 기기마다 다를 수 있습니다. 버튼 위치를 외우기보다 '화면에서 필요한 버튼을 찾는 연습'으로 활용하세요." },
  { q: "부모님을 대신해서 사용해도 되나요?", a: "네. 자녀분이 부모님 옆에서 함께 눌러보며 알려드리는 용도로도 좋습니다. 연습을 마치면 결과를 가족에게 공유할 수도 있습니다." },
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
    <section id="faq" style={{ background: "#FAF8F5", padding: "72px 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#C4621A", marginBottom: 6, letterSpacing: "0.05em" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#3B3226", letterSpacing: "-0.5px", marginBottom: 36 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${open === i ? "#E67E3F" : "#EFE3CC"}`, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", padding: "20px 22px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", minHeight: 52 }}>
                <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#C4621A", flexShrink: 0, marginTop: 1 }}>Q.</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E", lineHeight: 1.5 }}>{f.q}</span>
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && (
                <div style={{ padding: "0 22px 20px" }}>
                  <div style={{ borderTop: "1px solid #E8F0FE", paddingTop: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#E67E3F", marginRight: 8 }}>A.</span>
                    <span style={{ fontSize: 15, color: "#4A5568", lineHeight: 1.75 }}>{f.a}</span>
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
