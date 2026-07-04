"use client";
import { useState } from "react";

const faqs = [
  { q: "회원가입 없이 사용할 수 있나요?", a: "네. 기본 계산기와 체크리스트는 회원가입 없이 바로 사용할 수 있도록 설계했습니다. 별도 로그인이 필요하지 않습니다." },
  { q: "노후자금 계산 결과는 정확한 재무상담인가요?", a: "아닙니다. 입력값을 기준으로 한 참고용 시뮬레이션이며, 실제 재무 판단은 개인 상황에 따라 달라질 수 있습니다. 정확한 내용은 관련 전문가를 통해 확인하시기 바랍니다." },
  { q: "복지혜택 결과는 확정인가요?", a: "아닙니다. 복지혜택은 소득, 재산, 거주지, 제도 변경에 따라 달라질 수 있습니다. 확인이 필요한 항목을 안내하는 방식으로 제공하며, 정확한 수급 여부는 관련 기관에서 확인하셔야 합니다." },
  { q: "약 복용 기록은 의료 조언인가요?", a: "아닙니다. 복용약을 정리해 병원이나 약국에 보여줄 수 있도록 돕는 기록 보조 도구입니다. 약 복용과 관련된 의료적 판단은 반드시 의사나 약사에게 문의하셔야 합니다." },
  { q: "병원 체크리스트는 어떻게 활용하나요?", a: "병원 방문 전에 진료 목적을 선택하면 오늘 챙길 것과 의사에게 물어볼 질문이 정리됩니다. 복사하거나 인쇄해서 병원에 가져가시면 됩니다." },
  { q: "부모님을 대신해서 사용해도 되나요?", a: "네. 부모님 병원 준비, 복지혜택 확인, 노후자금 점검 등에 보호자가 함께 활용할 수 있습니다. 가족이 함께 준비하는 용도로도 사용하실 수 있습니다." },
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
    <section style={{ background: "#FAF8F5", padding: "72px 20px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1B6FC8", marginBottom: 6, letterSpacing: "0.05em" }}>FAQ</p>
        <h2 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#1A1A2E", letterSpacing: "-0.5px", marginBottom: 36 }}>자주 묻는 질문</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${open === i ? "#1B6FC8" : "#E8F0FE"}`, overflow: "hidden" }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", padding: "20px 22px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, textAlign: "left", minHeight: 52 }}>
                <span style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1B6FC8", flexShrink: 0, marginTop: 1 }}>Q.</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#1A1A2E", lineHeight: 1.5 }}>{f.q}</span>
                </span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" style={{ flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {open === i && (
                <div style={{ padding: "0 22px 20px" }}>
                  <div style={{ borderTop: "1px solid #E8F0FE", paddingTop: 16 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0EA5E9", marginRight: 8 }}>A.</span>
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
